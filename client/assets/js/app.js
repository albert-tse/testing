var app = (function () {
    'use strict';

    $.fn.foundation = function () { return; };

    var initialize = function () {
        // Prepare DOM Components
        setupTemplates();
        setupEvents();
        _.defer(initStatsDateRangePicker);

        document.body.classList.toggle('is-mobile', isMobile());
        renderButton();
    };

    var onSignIn = function (googleUser) {
        getApiKey(googleUser)
            .then(initFeed)
            .then(setSites)
            .then(filterContent)
            .fail(requestApiKey)
        ;
    };

    var onSignInFailure = function (err) {
        console.error(err);
    };

    var filterContent = function () {
        var promise = $.Deferred();

        // Check to see if we're linking to specific set of UCID's
        var ucids = getParameterByName('ucid');
        var related = getParameterByName('relatedto');

        if (ucids || related) {
            var allDates = true;

            // Show a message that the current results are limited to a specific list of articles
            $('.articleFilterMessage').show();

            // Bind click handler to remove article filter
            $('.clearArticleFilter').on('click', function () {
                feed.search.ucids = null;
                $('.articleFilterMessage').hide();
                searchContent(feed.search);
            });

            if (ucids) {
                feed.search.ucids = ucids;
                loadInitial();
                promise.resolve();
            } else {
                API.request(API_BASE_URL + '/articles/find-similar', {
                    ucid: related
                }).then(
                    function (related) {
                        if (related && related.status_txt == 'OK') {
                            var ids = related.data.hits.hit.map(function (el, i, a) {
                                return el.id;
                            }).join();

                            feed.search.ucids = ids;
                            loadInitial();
                            promise.resolve();
                        } else {
                            $('.articleFilterMessage').hide();
                            loadInitial();
                            promise.resolve();
                        }
                    }
                );
            }
        } else {
            $('.articleFilterMessage').hide();
            loadInitial();
            promise.resolve();
        }

        return promise;
    };

    /**
     * Initialize the feed before loading any articles
     */
    var initFeed = function () {
        var promise = $.Deferred();

        !feed.articles.hasOwnProperty("saved") ? feed.articles.stats = [] : null;
        !feed.articles.hasOwnProperty("shared") ? feed.articles.shared = [] : null;
        buttonFilter.init();
        generateClientFilter();
        $.fn.dataTable.moment("MMM Do, YYYY [at] h:mm A");

        // TODO Because of security purpose this should be done on the server side..
        if (user.role == "internal_influencer" || user.role == "external_influencer") {
            feed.search.enabled = 1;
            feed.search.link_types = 2; //The next line should be commented when we have the icon
        }

        return $.when(
            API.request(API_BASE_URL + '/users/' + user.email), // get user info
            API.request(API_BASE_URL + '/platforms')
        ).then(function (user, platforms) { // XXX not sure why each returns an argument list
            updateUser(user[0]);
            updateSites(user[0].sites);
            updatePlatforms(platforms[0]);
            return user[0].sites;
        });
    };

    // unblock when ajax is finished
    $(document).ajaxStop($.unblockUI);

    /**
     * Mark an article as deselected
     * @param this is the context
     */
    var deselect = function (index) {
        if ($(this).hasClass('selected')) {
            // Disable
            $(this).removeClass('selected');
            $(this).find('div.grid-item').removeClass('callout');
            $(this).find('.post').removeClass('selected');
            $(this).find('i').removeClass('selected');
            $(this).find(".network").stop().fadeOut(500);
        }
    };

    var clearSaved = function () {
        $("#selectable li").each(deselect);
        toggleLinkBar();
    };

    $(document.body).on("click", "#loadMore", function () {
        //double check in case there is no more articles
        if (feed.articles.more > 0) {
            $('#loadMore').block({
                message: '<i class="fa fa-spinner fa-pulse fa-inverse fa-lg"></i>',
                css: {
                    background: 'none',
                    border: 'none'
                }
            });
            searchMoreContent(feed.search, feed.articles.cursor, function (err, posts) {
                if (err) {
                    console.warn("There is an error ", err);
                } else {
                    feed.articles.more = (parseInt(posts.hits.found) - parseInt(posts.hits.start)) - posts.hits.hit.length;
                    feed.articles.cursor = posts.hits.cursor;
                    updateArticles(feed.articles.data.concat(posts.hits.hit));
                    posts.hits.hasOwnProperty('saved') ? feed.articles.stats = feed.articles.stats.concat(posts.hits.saved) : null;
                    posts.hits.hasOwnProperty('shared') ? feed.articles.shared = feed.articles.shared.concat(posts.hits.shared) : null;
                    appendContent(posts.hits.hit);
                    loadMoreBtn(feed.articles.more);
                }
            });
        }
    });

    // Event handler for switching tabs
    $(document.body).on('click', '.tab a', function (evt) {
        var $tab = $(this).closest('li');

        if ($tab.hasClass('active')) {
            evt.preventDefault();
            evt.stopPropagation();
            return false;
        }

        $('.tab.active').removeClass('active');
        $tab.addClass('active');

        document.body.className = document.body.className.replace(/(\w+-tab)/g, '');
        document.body.classList.add(this.dataset.name + '-tab');
    });

    // Event handler to enable My Links view
    $(document.body).on('click', '#my-links', function () {
        if (document.body.classList.contains('show-infobar')) {
            toggleInfoBar();
        }

        feed.view = 'mylinks';
        $('#container').css("padding-right", "0");
        // The search bar from Explore isn't meant to be used with My Links
        $("#search").val("");
        delete feed.search.text;

        if (user.role === 'publisher' && !!user.publisher_ids && user.publisher_ids.length > 0) {
            $('#source-row').hide();
            refreshMTDTable();
        } else {
            feed.search.influencer_ids = $('#partner').val();
            feed.selected_partner = getSelectedPartner();
            refreshMTDTable();
        }
    });
    
    var refreshMTDTable = function () {
        feed.mtdLinks = [];
        if (user.role === 'publisher') {
            _.each(user.publisher_ids, function (publisher) {
                getMTDTotalLinksShared('publishers', publisher).then(displayMTDTable).fail(log);
            });
        } else {
            getMTDTotalLinksShared('influencers', feed.selected_partner).then(displayMTDTable).fail(log);
        }
    };

    /**
     * Get the currently selected partner from web storage
     * @return string the current selected partner
     */
    var getSelectedPartner = function () {
        var selected = localStorage.getItem(config.storageKeys.partner);
        if (!_.chain(feed.partners).pluck('id').contains(selected).value()) {
            selected = $(config.elements.firstPartner).val();
        }

        return selected;
    };

    /**
     * Redraw listener for the links datatable
     *
     * TODO: Figure out a good way to kill of any existing refresh loops,
     *       technically a link could still be displayed after a redraw, and we would be
     *       adding additional refresh cycles for the same link.
     */
    $(config.elements.mtdLinkTable).on('draw.dt', function () {
        $('.tooltips:not(.tooltipstered)').tooltipster({
            interactive: true,
            maxWidth: 400,
            theme: 'tooltipster-light'
        }); //Initialize tooltipster

        var linksTable = $(config.elements.mtdLinkTable).DataTable();
        linksTable.rows().every(function (rowIdx, tableLoop, rowLoop) {
            var shortLink = $('<a href="' + this.data()[6] + '" target="_blank">' + this.data()[6] + "</a>");
            if ($("a[href='" + this.data()[5] + "']").get().length !== 0) {
                $("a[href='" + this.data()[5] + "']").tooltipster('content', shortLink);
            }
        });
        if (linksDatatable) {
            var displayedRows = linksDatatable.rows({
                selected: true
            }).data();
            displayedRows.rows().every(function (rowIdx, tableLoop, rowLoop) {
                // Some random amount of time so our API calls aren't all happening at the exact same time
                var fuzz = Math.floor(Math.random() * 500);
                // Start a refresh loop for this link
                window.setTimeout(refreshClicks, 5000 + fuzz, this.data()[0], this.data()[1][0]);
            });
        }
    });

    var formatNum = function () {
        $(".numFormat").each(function (index, value) {
            var str = $(this).text();
            //if not already called call it. usefull for dynamic loading
            if (str.indexOf(",") == -1) {
                $(this).html(numeral(str).format('0,0'));
            }
        });
    };

    var initStatsDateRangePicker = function () {
        var $statsPicker = $(config.elements.statsDateRangePicker);

        $statsPicker.daterangepicker({
            datepickerOptions: config.options.datepicker,
            dateFormat: 'm/d/y',
            presetRanges: [{
                text: 'This Month (MTD)',
                dateStart: function () {
                    return moment().startOf('month');
                },
                dateEnd: function () {
                    return moment();
                }
            }, {
                text: moment().subtract(1, 'month').format('MMMM YYYY'),
                dateStart: function () {
                    return moment().subtract(1, 'months').startOf('month');
                },
                dateEnd: function () {
                    return moment().subtract(1, 'months').endOf('month');
                }
            }, {
                text: moment().subtract(2, 'months').format('MMMM YYYY'),
                dateStart: function () {
                    return moment().subtract(2, 'months').startOf('month');
                },
                dateEnd: function () {
                    return moment().subtract(2, 'months').endOf('month');
                }
            }, {
                text: moment().subtract(3, 'months').format('MMMM YYYY'),
                dateStart: function () {
                    return moment().subtract(3, 'months').startOf('month');
                },
                dateEnd: function () {
                    return moment().subtract(3, 'months').endOf('month');
                }
            }, ],
            onChange: function () {
                var range = $statsPicker.daterangepicker('getRange');
                feed.search.timestamp_start = range.start;
                feed.search.timestamp_end = range.end;
                if ($(document.body).hasClass('stats-tab')) {
                    refreshMTDTable();
                }
            }
        });

        $statsPicker.daterangepicker('setRange', {
            start: moment().startOf('month').toDate(),
            end: moment().endOf('day').toDate()
        });

        var searchText = getParameterByName('q'); // Check for a search query in the URL, and prefill the search box if exists
        $("#search").val(feed.search.text = searchText); // Will  be blank if there is none
        _.defer(initDatePicker, searchText); // If true, the date picker will default to "All Time". This is useful if searching for a specific URL, for example.
    };

    var initDatePicker = function (allTime) {
        $('#reportrange').daterangepicker({
            presetRanges: [{
                text: 'Today',
                dateStart: function () {
                    return moment();
                },
                dateEnd: function () {
                    return moment();
                }
            }, {
                text: 'Last 7 Days',
                dateStart: function () {
                    return moment().subtract(6, 'days');
                },
                dateEnd: function () {
                    return moment();
                }
            }, {
                text: 'Last 30 Days',
                dateStart: function () {
                    return moment().subtract(29, 'days');
                },
                dateEnd: function () {
                    return moment();
                }
            }, {
                text: 'All Time',
                dateStart: function () {
                    return moment().subtract(100, 'years');
                },
                dateEnd: function () {
                    return moment();
                }
            }],
            datepickerOptions: config.options.datepicker,
            applyOnMenuSelect: true,
            dateFormat: 'm/d/y'
        });

        // If we're defaulting to all time, set the range to last 100 years, otherwise last 7 days
        if (allTime) {
            $("#reportrange").daterangepicker("setRange", {
                start: moment().subtract(100, 'years').startOf("day").toDate(),
                end: moment().endOf("day").toDate()
            });
        } else {
            $("#reportrange").daterangepicker("setRange", {
                start: moment().subtract(6, 'days').startOf("day").toDate(),
                end: moment().endOf("day").toDate()
            });
        }
    };

    // TODO confirm it is dead Code?
    var generateClientFilter = function () {
        return;
        var clients = [];
        //Find the clients loaded
        $('.client').each(function (index, value) {
            value = $(value).text();
            if ($.inArray(value, clients) == -1) {
                clients.push(value);
            }
        });
        //need to remove the client already added on a previous load
        $('.checkable').each(function (index, value) {
            value = $(value).text().trim();
            if ($.inArray(value, clients) != -1) {
                clients.splice(clients.indexOf(value), 1);
            }
        });
        //add the client to the top menu with the correct formating
        for (var i = 0; i < clients.length; i++) {
            var client = clients[i];
            if ($('#source').find('a[data-filter=".client-' + client + '"]').length === 0) {
                var elem = '<option><a href="#" class="checkable" data-filter=".client-' + client.split(".").join("-") + '"><input type="checkbox"/>&nbsp;' + client + '</a></option>';
                $('#source').append(elem);
            }
        }
    };

    // show / hide get links bar
    var toggleLinkBar = function () {
        if ($(config.elements.grid).find('*').hasClass('selected')) {
            $('#feed-links').slideDown(200);
        } else {
            $('#feed-links').slideUp(200);
        }
    };

    /**
     * Show / hide info bar
     * @param boolean show the info bar if true
     */
    var toggleInfoBar = function () {
        var isVisible = document.body.classList.toggle('show-infobar');

        if (!isVisible) {
            $(config.elements.infoBar).attr('data-id', '');
            $(config.elements.clearSelection).click();
        }

        return;
    };

    /**
     * Reduce the amount of grid columns to show when info bar is visible
     * @param boolean isInfoBarVisisble is true when it is being shown
     */
    function adjustGridCount(isInfoBarVisible) {
        isInfoBarVisible = isInfoBarVisible ? -1 : 1;
        var grid = document.getElementById('selectable'),
            adjustedColumns = [].map.call(grid.classList, function (classname) {
                return classname.replace(/\d+/, function (num) {
                    return parseInt(num) + isInfoBarVisible;
                });
            }).join(' ');

        grid.className = adjustedColumns;
    }

    // Load initial content
    var loadInitial = function () {
        var initialViewMode = localStorage.getItem(config.storageKeys.mode) || 'grid';
        $(config.elements.viewMode.replace(/value/, initialViewMode)).click();
        publisherIds = _.pluck(activeSources, 'id');
        feed.search.site_ids = [].join.call(getSelectedSitesFromStorage(), ',');
        feed.site_ids = publisherIds.toString();

        updateSearchDateRange();

        feed.selected_partner = getSelectedPartner();

        if (user.role === 'publisher') {
            feed.search.sort = 'creation_date desc';
            feed.search.order = 'desc';
        }

        var defaultSorting = localStorage.getItem(config.storageKeys.sort);
        if (!!defaultSorting) {
            feed.search.sort = defaultSorting;
            $(config.elements.sortDropdown).val(/rand/.test(feed.search.sort) ? 'random' : feed.search.sort);
        }

        loadContent();

        /*
        $('#explore').click();

        $('#main').mixItUp({ // Instantiate MixItUp
            controls: {
                enable: false // we won't be needing these
            },
            load: {
                filter: 'all'
            },
            callbacks: {
                onMixEnd: function (state) {
                    // $(document).foundation();
                }
            }
        });
        */

        // Display articles after equalization
        $('#main .invisible.grid-item').removeClass('invisible');
        /*
        $(document).foundation({
            equalizer: {
                after_height_change: function () {
                }
            },
        });
        */

        $(".network").css("display", "flex").hide();

        $("#reportrange").daterangepicker({
            onChange: function () {
                updateSearchDateRange();
                searchContent(feed.search);
            }
        });
    };

    var updateSearchDateRange = function () {
        var value = $("#reportrange").daterangepicker("getRange");
        var start = moment(value.start).startOf("day").toDate();
        var end = moment(value.end).endOf("day").toDate();
        feed.search.date_start = start;
        feed.search.date_end = end;
    }

    /**
     * sort an array of object by name
     * @param  {object} a
     * @param  {object} b
     * @return {sorted object by name}
     */
    var compare = function (a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    };

    /**
     * Append to the site pulldown the current sites
     * @param  json sites json sites
     */
    var renderSites = function () {
        var sortedSites = activeSources.sort(compare);
        _.each(sortedSites, function (site) {
            var displayName = site.name;

            if (site.enabled === 0) {
                displayName += ' (Disabled)';
            }

            $('#source').append(templates.sourceOption({
                value: site.id,
                label: displayName + ' - ' + site.url
            }));
        });
        $(config.elements.sourcesDropdown).multipleSelect({
            onClose: function (view) {
                var selected = $('#source').multipleSelect("getSelects"),
                    id = selected.toString(),
                    _oldSelected = feed.search.site_ids;

                selected.length > 0 ? feed.search.site_ids = id : feed.search.site_ids = feed.site_ids;
                localStorage.setItem(config.storageKeys.sites, JSON.stringify(selected));

                // Search for either content or links data depending on which tab we're currently in
                if (_oldSelected !== feed.search.site_ids) {
                    switch (feed.view) {
                        case 'explore':
                            searchContent(feed.search);
                            break;
                        case 'mylinks':
                            refreshMTDTable();
                            break;
                    }
                }
            }
        }).multipleSelect('setSelects', getSelectedSitesFromStorage());
    };

    /**
     * Get the selected sites from the session
     * @return array of site ids || null
     */
    var getSelectedSitesFromStorage = function () {
        var sites = JSON.parse(localStorage.getItem(config.storageKeys.sites)) || [],
            available = getAllAvailableSites();

        return _.intersection(sites, available).length > 0 ? _.intersection(sites, available) : available;
    };

    /**
     * Get the site ids of all the sites available
     * @return array of site ids || empty array
     */
    var getAllAvailableSites = function () {
        return $(config.elements.sourceOptions).map(function () {
            return this.value;
        });
    };

    /**
     * Set the user info
     * @param Object user to update
     */
    var updateUser = function (userData) {
        user = userData;
        updatePartners(userData.influencers);
        document.body.classList.add(user.role + '-role');
    };

    /**
     * Set the sites data
     * @param Array sites to add to list
     */
    var updateSites = function (sites) {
        feed.sites = sites;
        feed.scoreMap = mapPublisherToScore();
    };

    /**
     * Update the partners list
     * Use this method whenever the partners data has to be changed
     * Add any functions that should be called upon changing feed.partners here
     * @param Array partners new value
     */
    var updatePartners = function (influencers) {
        feed.partners = influencers;
        generatePartners(); // Reset dropdown menu
    };

    /**
     * Update the platforms list
     * This will be used to map platform ids to names
     * @param Object platforms
     */
    var updatePlatforms = function (platforms) {
        feed.platforms = platforms;
        feed.platforms.names = [];
        for (var i = 0; i < feed.platforms.data.length; i++) {
            feed.platforms.names[feed.platforms.data[i].id] = feed.platforms.data[i].name;
        }
    };

    /**
     * Populate Partner pulldown for user
     */
    var generatePartners = function () {
        var dropdownMenu = document.getElementById('partner'),
            menuHTML = '';

        var ids = _.chain(feed.partners).sortBy(function (partner) {
            return partner.name.toLowerCase();
        }).map(function (partner) {
            menuHTML += templates.partnerOption({
                id: partner.id,
                name: partner.name
            });
            return partner.id;
        }).value();

        feed.search.influencer_ids = ids.join();
        feed.selected_partner = getSelectedPartner();
        dropdownMenu.innerHTML = menuHTML;
        $(config.elements.selectedPartner).val(feed.selected_partner || $(config.elements.firstPartner).val());
    };

    /**
     * Adds content to the grid
     * @param Array posts that need to be converted to Element and appended to grid
     */
    var insertContentToGrid = function (posts) {
        // clear the container
        var main = $(config.elements.grid),
            clone = $('#proto').html(),
            timestamp, elem, post, site_id, name, elemHtml;

        // populate all data from cs for saving
        var frag = document.createDocumentFragment();
        for (var i = 0; i < posts.length; i++) {
            elemHtml = clone;
            elem = posts[i].fields;
            if (elem && elem.site_id && elem.url && elem.title && elem.ucid && elem.client_id && elem.site_id && elem.creation_date) {
                post = $(elemHtml);
                site_id = elem.site_id[0];
                post.find('.url').attr('href', elem.url[0]);
                post.find('.title').prepend(elem.title[0] + ' ');
                post.find('.desc').text('description' in elem ? elem.description[0].substr(0, 120) + '...' : 'No description');

                if ('image' in elem) {
                    preloadImage(elem.image[0].replace(/http:/, 'https:'), post.find('.th').get(0));
                }

                if (site_id > 0) {
                    var site = getSourceName(site_id);
                    name = site.name;

                    var score = feed.scoreMap[name] || '';
                    post.find('.sitename').text(name + post.find('.sitename').text());

                    if (user.role !== 'publisher' && score !== '') {
                        $(templates.score({
                            score: score
                        })).insertAfter(post.find('.sitename'));
                    }
                }
                timestamp = moment(elem.creation_date[0]).fromNow();
                post.find('.date').text(timestamp + post.find('.date').text());
                post.find('.date').attr('rawDate', elem.creation_date[0]);
                post.find('.info').attr('ucid', elem.ucid[0]);
                post.attr('data-id', elem.ucid[0]);
                post.attr('data-client-id', elem.client_id[0]);
                post.attr('data-site-id', elem.site_id[0]);
                post.attr('data-link_type', posts[i].fields.link_type ? posts[i].fields.link_type[0] : 2);
                hasStats(elem.ucid[0]) ? showStatsIcon(post) : null;
                var sharedNumber = getSharedNumber(elem.ucid[0]);
                Object.keys(sharedNumber).length > 0 ? showSharedNumber(post, sharedNumber) : null;

                // Show performance stats
                var performance = posts[i].fields.stat_type_95 * 100;
                if (performance > 0) {
                    var label = 'bad';
                    if (performance < 6) {
                        label = 'average';
                    } else if (performance < 13) {
                        label = 'good';
                    } else if (performance >= 13) {
                        label = 'very good';
                    }
                    post.find('.performance').text(label).addClass(label.replace(' ', '-'));
                    post.find('.performance').removeClass('hidden');
                }

                // enable/disable article
                post.find('.visibility').get(0).dataset.id = elem.ucid;
                post.toggleClass('disabled', ('enabled' in elem && 'length' in elem.enabled && elem.enabled[0] === '0') || !('enabled' in elem)); // disable article if '0' or is not set

                // utm article
                var $utm = post.find(config.elements.articleUtmField);
                $utm.get(0).dataset.ucid = elem.ucid;
                if ('utm' in elem) {
                    $utm.val(elem.utm);
                }
            }
            frag.appendChild(post.get(0));
        }

        main.append(frag);
        $('.menu-group.loading').removeClass('loading');
        showSavedArticles();
    };

    /**
     * Pass a new object of posts from CS to this function when you need a refresh
     */
    var refreshContent = function (posts, callback) {
        $(config.elements.grid).empty();
        posts.length === 0 ? $('.noResultsMessage').show() : $('.noResultsMessage').hide(); // If we didn't find any posts, display a message to the user
        insertContentToGrid(posts);
        $('#searchlabel').text("Search returned " + feed.articles.found + " results");
        $("#loadMore").css('display', 'inline-block');
        callback();
    };

    /**
     * Initializes the datatable for the My Links view
     */
    var refreshLinks = function (links, callback) {
        linksDatatable = $(config.elements.mtdLinkTable).DataTable({
            autoWidth: false,
            destroy: true,
            deferRender: false,
            data: links,
            pageLength: localStorage.getItem(config.storageKeys.pageLengthMyStats) || 50,
            dom: '<"row"<"small-6 columns"l><"small-6 columns"fT>>rt<"row"<"small-6 columns"i><"small-6 columns"p>>',
            tableTools: {
                sSwfPath: "//cdn.datatables.net/tabletools/2.2.0/swf/copy_csv_xls_pdf.swf",
                aButtons: [{
                    sExtends: "copy",
                    oSelectorOpts: {
                        filter: "applied",
                        order: "current"
                    }
                }, "csv", "xls", {
                    sExtends: "pdf",
                    sPdfOrientation: "landscape"
                }]
            },
            columns: [{
                title: "Hash",
                className: "th-hash",
                visible: false,
                searchable: false
            }, {
                title: "Partner ID",
                className: "th-partnerID",
                visible: false,
                searchable: false
            }, {
                title: "Title",
                className: "th-title",
                width: "30%",
                render: function (data, type) {
                    return type === 'display' ? data.replace(/\\/g, '') : data;
                }
            }, {
                title: "Platform",
                className: "th-channel"
            }, {
                title: "Site",
                className: "th-site"
            }, {
                title: "URL",
                className: "th-shortlink",
                width: "8rem",
                render: function (data, type, row, meta) {
                    var opts = {
                        url: data.replace("http://", ""),
                        target: 'shortlink-' + row[0]
                    };

                    return templates.copiableLink(opts);
                }
            }, {
                title: "Full URL",
                className: "th-link",
                visible: false,
                searchable: false
            }, {
                title: "Revenue",
                className: "th-revenue",
                render: function (data, type, full, meta) {
                    return type === 'display' ? numeral(data).format("$0,0.00") : data;
                }
            }, {
                title: "CPC",
                className: "hide th-cpc"
            }, {
                title: "Clicks",
                className: "th-clicks",
                render: withCommas
            }, {
                title: "CTR",
                className: "th-ctr"
            }, {
                title: "Reach",
                className: "th-reach",
                render: withCommas
            }, {
                title: "Post Date",
                className: "th-creationdate",
                width: "200px",
                render: function (data, type, full, meta) {
                    return type === 'display' ? moment.utc(data, 'YYYY-MM-DD[T]HH:mm:ss[Z]').local().format("MMM Do, YYYY [at] h:mm A ") : data;
                }
            }],
            columnDefs: [{
                targets: [3, 4, 5, 6],
                width: "100px"
            }],
            fixedHeader: true,
            createdRow: function (row, data, index) {
                    $(row).attr('hash', data[0]);
                    $(row).attr('partner_id', data[1]);
                }
                // responsive: true
        });

        linksDatatable.on('length', function (evt, settings, newValue) {
            localStorage.setItem(config.storageKeys.pageLengthMyStats, newValue);
        });

        callback(linksDatatable);
    };

    /**
     * Render the integer with commas when displaying
     * @param Object data to render
     * @param String type of action to take ie. display and sort
     * @param Object full 
     * @param Object meta
     * @return String formatted integer with commas added to every thousands group
     */
    var withCommas = function (data, type, full, meta) {
        return type === 'display' ? numeral(data).format('0,0') : data;
    };
    /**
     * Turn the article into green if saved for selected partner
     */
    var showSavedArticles = function () {
        var articleSaved = {};
        for (var i = 0; i < feed.articles.stats.length; i++) {
            var tmp = feed.articles.stats[i];
            if (!articleSaved[tmp.ucid]) {
                articleSaved[tmp.ucid] = [];
            }
            articleSaved[tmp.ucid].push(parseInt(tmp.partner_id));
        }
        for (var ucid in articleSaved) {
            if (articleSaved[ucid].indexOf(parseInt(feed.selected_partner)) != -1) {
                $('.article[data-id=' + ucid + ']').removeClass('not-saved').addClass('saved');
            } else {
                $('.article[data-id=' + ucid + ']').addClass('not-saved').removeClass('saved');
            }
        }
    };

    /**
     * search content from the selected sites, text and actives partners will call generateInitArticles to make the html
     * TODO: Instead of relying on whatever filters we have to modify feed.search in event handlers, we should check the status of
     * those filters here and build the search query before sending it.
     */
    var searchContent = function (obj, callback) {
        blockUI();
        API.request(API_BASE_URL + '/articles', obj).then(updateFeed);
    };

    var searchMoreContent = function (obj, cursor, callback) {
        var query = jQuery.extend(true, {}, obj);
        query.cursor = cursor;
        API.request(API_BASE_URL + '/articles').then(function (posts) {
            if (typeof posts.status == 'object') {
                callback(null, posts);
            } else {
                callback("an error happened: " + posts);
            }
        });
    };

    /**
     * Shows a loading animation to block any ui interactions
     */
    var blockUI = function () {
        $.blockUI({
            message: '<div class="loader"> <svg class = "circular" > <circle class = "path" cx = "50" cy = "50" r = "20" fill = "none" stroke - width = "2" stroke - miterlimit = "10" /> </svg> </div>',
            css: {
                background: 'none',
                border: 'none'
            }
        });
    };

    /**
     * Call this function wherever you want to log errors from API request
     * @param Object data it responded with
     * @param Object xhr containing information about the request
     */
    var logError = function (data, xhr) {
        log(data);
        log(xhr);
    };

    /**
     * Set defaults here so we don't get DataTable errors
     * @param array posts to sanitize
     */
    var sanitize = function (posts) {
        _.each(posts, function (post) {
            if (!('title' in post.fields)) {
                post.fields.title = ['Untitled'];
            }
        });
    }

    /**
     * Reload the articles section with new data fetched from server
     * and update the feed data
     * @param Object posts fetched from the server
     */
    var updateFeed = function (posts) {
        if (typeof posts.status == 'object') {
            feed.articles.more = (parseInt(posts.hits.found) - parseInt(posts.hits.start)) - posts.hits.hit.length;
            feed.articles.cursor = posts.hits.cursor;
            feed.articles.found = posts.hits.found;
            var postsContent = posts.hits.hit;
            updateArticles(postsContent);
            posts.hits.hasOwnProperty('saved') ? feed.articles.stats = posts.hits.saved : null;
            posts.hits.hasOwnProperty('shared') ? feed.articles.shared = posts.hits.shared : null;
            $("#feedSearchInfo").hide();
            $("#loadMore").hide();
            refreshContent(feed.articles.data, function () {
                loadMoreBtn(feed.articles.more);
                $.unblockUI();
            });

            // $('#main').mixItUp('filter', buttonFilter.outputString);
        } else {
            log('nope');
            alert('client delete connection error');
        }
    };

    var log = function (x) {
        console.log(x);
    };

    var loadMoreBtn = function (more) {
        $("#feedSearchInfo").show();
        // var state = $('#main').mixItUp('getState');
        var state = 'general';
        $('#feedSearchInfo').text("Showing " + state.totalShow + " out of " + feed.articles.found + " results.");
        $('#feedSearchInfo').text("Showing " + state.totalShow + " out of " + feed.articles.found + " results.");
        if (more > 0) {
            $("#loadMore").show();
            $("#loadMore").text("Load More Results").css('display', 'inline-block');
        } else {
            $("#loadMore").hide();
        }
    };

    var getSourceName = function (site_id) {
        var site = _.find(sourceList, function (site) {
            return site.id == site_id;
        }) || {
            name: 'Unknown'
        };
        return site;
    };

    var appendContent = function (posts) {
        insertContentToGrid(posts);
        $("#loadMore").css('display', 'inline-block');
        $('#searchlabel').text("Search returned " + feed.articles.found + " results");
    };

    /**
     * Download the images in the background before displaying them to the DOM
     * @param String src points to the image URL
     * @param Element img we need to put the loaded image on
     */
    var preloadImage = function (src, img) {
        var loader = new Image();
        img.dataset.src = src;
        loader.src = src;
        loader.onload = imageLoaded.bind(img); // Note: we just want to be notified when it's loaded so we don't use the Element from loader
    };

    /**
     * Once image is loaded, update the Element's src attribute to display it
     */
    var imageLoaded = function () {
        this.classList.add('loaded');
        this.src = this.dataset.src;
    };

    //SAVE LINK
    var save_links = function () {
        var dataAjax = [];
        $('#info-bar .title').hide();
        $('#info-bar .source').hide();
        $("#feedStats").html(statsTable);
        $('li.selected').each(function (argument) {
            var post = $(this);
            var plats = post.find('.post i.selected');
            plats.each(function (i) {
                var data = {};
                data.url = post.find('.url').attr('href');
                data.partner_id = parseInt($('#partner').val());
                data.platform_id = $(this).attr('data-id');
                data.ucid = post.attr('data-id');
                data.title = post.find('.title').text();
                log(data.title);
                data.client_id = post.attr('data-client-id');
                data.link_type = post.attr('data-link_type');
                data.description = post.find('.description').html();
                data.image = post.find('img:first').attr('src');
                data.site_id = post.attr('data-site-id');
                data.date = post.find('.date').attr('rawDate');
                data.user_email = user.email;
                data.article_utm = post.find('.utm-tags input').val();
                dataAjax.push({
                    "post": post,
                    "data": data
                });
            });
        });
        async.each(dataAjax, function (obj, callback) {
            // Perform operation on file here.
            log('Processing data ', obj.data);
            var data = obj.data;
            var post = obj.post;
            API.request(API_BASE_URL + '/links', data, 'post').then(function (msg) {
                log('raw output');
                log(msg);
                log('--------------');
                if (msg.status_txt !== 'ERROR') {
                    data.shortlink = msg.shortlink;
                    //TODO parse hash better
                    var prefixLength = "http://po.st/".length,
                        hash = data.shortlink.substring(prefixLength, data.shortlink.length),
                        post = $('#selectable .article[data-id=ucid]'.replace(/ucid/, data.ucid)),
                        shared = getSharedNumber(data.ucid),
                        stats = {
                            "hash": hash,
                            "partner_id": data.partner_id,
                            "platform_id": data.platform_id,
                            "ucid": data.ucid
                        };

                    if (_.where(feed.articles.stats, {
                            hash: hash
                        }).length === 0) {
                        feed.articles.stats.push(stats);
                        showSharedNumber(post, getSharedNumber(data.ucid));
                    }

                    log(hash);
                    appendLinksSideBar(post, data, hash);
                    callback();
                } else {
                    log('Error');
                    log(msg);
                    log('--------------');
                    callback(msg);
                }
            });

        }, function (err, msg) {
            showSavedArticles();
            // if any of the file processing produced an error, err would equal that error
            if (err) {
                // One of the iterations produced an error.
                // All processing will now stop.
                console.error('error ', err);
            } else {
                $("#selectable li").each(deselect);
                log('No err');
            }
        });
    }; // end save links

    /**
     * boolean indicating if an article is saved
     * @param  {int}  ucid        ucid to search for
     * @param  {int}  partner_id
     * @param  {int}  platform_id
     * @return {Boolean}             true if saved else false
     */
    var isSaved = function isSaved(ucid, partner_id, platform_id) {
        var _currentStat;
        for (var i = 0; i < articles.stats.length; i++) {
            _currentStat = articles.stats[i];
            if (_currentStat.ucid == ucid && _currentStat.platform_id == platform_id && _currentStat.partner_id == partner_id) {
                return true;
            }
        }
        return false;
    };

    var hasStats = function (ucid) {
        j = getSaved(ucid);
        if (_.some(j, function (o) {
                return _.has(o, "stats");
            })) {
            return true;
        } else {
            return false;
        }
    };
    var getSharedNumber = function (ucid) {
        var saved = getSaved(ucid);
        var categories = _.countBy(saved, function (obj) {
            return obj.platform_id;
        });
        return categories;
    };

    /**
     * Get the saved value (hash + platform + stats if exist) for a given ucid and partner_id
     * @param  {int} ucid
     * @param  {int} partner_id
     * @return {array of object}
     */
    var getSaved = function (ucid) {
        var _currentStat;
        var saved = [];
        for (var i = 0; i < feed.articles.stats.length; i++) {
            _currentStat = feed.articles.stats[i];
            if (_currentStat.ucid == ucid) {
                saved.push(_currentStat);
            }
        }
        return saved;
    };

    /**
     * Get the saved values for an array of ucid for a given partner
     * @param  {array of int} ucids
     * @param  {int} partner_id
     * @return {array of object}
     */
    var getSavedArray = function (ucids) {
        var _currentStat;
        var saved = [];
        for (var i = 0; i < feed.articles.stats.length; i++) {
            _currentStat = feed.articles.stats[i];
            if (ucids.indexOf(_currentStat.ucid) != -1) {
                saved.push(_currentStat);
            }
        }
        return saved;
    };

    var get_info = function (event) {
        var ucid = $(this).attr('ucid');
        if (ucid == $('#info-bar').attr('data-id') || !document.body.classList.contains('show-infobar')) {
            toggleInfoBar();
        }
        var target = $(event.target),
            savedInfo = getSaved(ucid),
            title = target.closest('.grid-item').find('.title').text(),
            site = target.closest('.grid-item').find('.sitename').text(),
            info,
            headline = {
                "title": title,
                "site": site
            };
        if (savedInfo.length > 0) {
            var formatedInfo = [];
            for (var j = 0; j < savedInfo.length; j++) {
                info = savedInfo[j];
                var elem = {};
                elem.stats = [];
                for (var key in info) {
                    if (key.indexOf("type:") != -1) {
                        elem.stats.push({
                            "name": getStatName(key),
                            "value": info[key],
                            "type": key
                        });
                    } else {
                        elem[key] = info[key];
                    }
                }
                formatedInfo.push(elem);
            }
            appendInfoSideBar(headline, formatedInfo);
        } else {
            $('#info-bar').attr('data-id', ucid);
            $('#info-bar .title').text(headline.title);
            $('#info-bar .source').text(headline.site);
            $("#feedStats").text("Sorry, no stats are available for this article :(");
        }

        $('#open-infobar').click();
    };

    /**
     * Put the info in the side bar
     * @param  {Array of object} headline
     * @param  {Array of object} formatedInfo
     */

    var appendInfoSideBar = function (headline, formatedInfo) {
        var _hasStats;
        //TODO put statsTable in an object
        $('#info-bar').attr('data-id', formatedInfo[0].ucid);
        $("#feedStats").html(statsTable);
        $('#info-bar .title').show().text(headline.title);
        $('#info-bar .source').show().text(headline.site);

        _influencers = (_.groupBy(formatedInfo, 'partner_id'));
        _.each(_influencers, function (key, value) {
            var _influencerGroup = _.sortBy(_influencers[value], 'platform_id');
            $('#statsBody').append("<tr><td colspan='2' style='text-align:center;'><h3>" + _.map(key, 'influencer_name')[0] + "</h3></td></tr>");
            _.each(_influencerGroup, function (key, value) {
                var theLink = 'http://qklnk.co/' + _influencerGroup[value].hash;
                $("#statsBody").append("<tr><td class='bold'>" + feed.platforms.names[_influencerGroup[value].platform_id] + "</td><td style='font-size:small;'><a href='" + theLink + "' target='_blank'>" + theLink + "</a></td></tr>");
                _hasStats = _influencerGroup[value].hasOwnProperty('stats') && _influencerGroup[value].stats.length > 0;
                if (_hasStats) {
                    var _stats = _influencerGroup[value].stats;
                    _.each(_stats, function (key, value) {
                        var _statsElem = _stats[value];
                        $("#statsBody").append("<tr><td>" + _statsElem.name + "</td><td>" + numeral(_statsElem.value).format('0,0') + "</td></tr>");
                    });
                } else {
                    $("#statsBody").append("<tr><td colspan='2' style='font-size:small; text-align:center;'>There are no stats available for this link.</td></tr>");
                }
                $("tr").last().css("border-bottom", "solid 1px #DDDDDD");
            });
        });
    };

    /**
     * Put generated links in the side bar
     * @param  {Array of object} formatedInfo
     */
    var appendLinksSideBar = function (post, data, hash) {
        var _currentPost = data.ucid.toString();
        if (!$("#statsBody").children().hasClass(_currentPost)) {
            $("#statsBody").append("<tr class='" + _currentPost + "'><td colspan='2' style='font-size:small; text-align:center;'>" + data.title + "</td></tr>");
        }
        var theLink = 'http://qklnk.co/' + hash;
        $("#statsBody ." + _currentPost).after("<tr><td class='bold'>" + feed.platforms.names[data.platform_id] + "</td><td style='font-size:small;'><a href='" + theLink + "' target='_blank'>" + theLink + "</a></td></tr>");
    };
    /**
     * Show if the post has been shared or not in the html
     * @param  {jquery object} post that is shared
     */
    var showStatsIcon = function (post) {
        post = $(post);
        post.find(".client").append(' <i class="fa fa-bar-chart"></i>');
        post.removeClass('not-shared').addClass('shared');
    };
    var showSharedNumber = function (post, shared) {
        post = $(post);
        post.removeClass('not-shared').addClass('shared');
        post.find('.social').empty();
        _.each(shared, function (value, index) {
            var name = feed.platforms.names[index] || 'question-circle';

            if (name === 'Google +') {
                name = 'google-plus';
            }

            if (name !== 'question-circle') {
                name = name.toLowerCase() + '-square';
            }
            post.find(".social").append('<i class="fa fa-' + name + '">&nbsp;</i><span class="sharedNumber">' + value + '&nbsp;</span>');
        });
    };

    var buttonFilter = {
        // Declare any variables we will need as properties of the object
        $filters: null,
        groups: [],
        outputArray: [],
        outputString: 'all',
        // The "init" method will run on document ready and cache any jQuery objects we will need.
        init: function () {
            var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "buttonFilter" object so that we can share methods and properties between all parts of the object.
            self.$filters = $('#Filters');
            self.$container = $('#main');
            self.$filters.find('.button-group').each(function () {
                var $this = $(this),
                    groupName = $this.data('group'),
                    storedFilter = localStorage.getItem('filters:' + groupName) || '',
                    $activeFilter = $this.find('[data-filter="' + storedFilter + '"]');

                $this.find('.filter.active').removeClass('active');
                $activeFilter.addClass('active');

                self.groups.push({
                    $buttons: $this.find('.filter'),
                    active: $activeFilter
                });
                self.parseFilters();
            });
            self.bindHandlers();
        },
        // The "bindHandlers" method will listen for whenever a button is clicked.
        bindHandlers: function () {
            var self = this;
            // Handle filter clicks
            self.$filters.on('click', '.filter', function (e) {
                e.preventDefault();
                var $button = $(this),
                    $group = $button.closest('ul');

                // If the button is active, remove the active class, else make active and deactivate others.
                $group.find('.filter').removeClass('active');
                $button.addClass('active');
                localStorage.setItem('filters:' + $group.data('group'), $button.data('filter'));
                self.parseFilters();
            });
        },
        // The parseFilters method checks which filters are active in each group:
        parseFilters: function () {
            var self = this;
            // loop through each filter group and grap the active filter from each one.
            for (var i = 0, group; group = self.groups[i]; i++) {
                group.active = group.$buttons.length ?
                    group.$buttons.filter('.active').attr('data-filter') || '' :
                    group.$dropdown.val();
            }
            self.concatenate();
        },
        // The "concatenate" method will crawl through each group, concatenating filters as desired:
        concatenate: function () {
            var self = this;
            self.outputString = ''; // Reset output string
            for (var i = 0, group; group = self.groups[i]; i++) {
                self.outputString += group.active;
            }
            // If the output string is empty, show all rather than none:
            !self.outputString.length && (self.outputString = 'all');
            log(self.outputString);
            // ^ we can check the console here to take a look at the filter string that is produced
            // Send the output string to MixItUp via the 'filter' method:
            if (self.$container.mixItUp('isLoaded')) {
                self.$container.mixItUp('filter', self.outputString);
            }
        }
    };

    var refreshClicks = function (hash, partner_id) {
        // Look up partner for api key based on partner ID
        var partner = _.findWhere(feed.partners, {
            id: parseInt(partner_id).toString()
        });
        if (partner && partner.key) {
            var data = {
                apiKey: partner.key,
                hash: hash,
                days: 365
            };

            API.refreshClicks(data).then(function (data) {
                //update the clicks and revenue values for the row that has this hash
                var tableRow = $("tr[hash='" + hash + "']");
                if (tableRow.length > 0) {
                    var clicksCell = tableRow.find('.th-clicks');
                    var cpcCell = tableRow.find('.th-cpc');
                    var revenueCell = tableRow.find('.th-revenue');
                    var options = {};
                    var value = numeral().unformat(clicksCell.text() !== '' ? clicksCell.text() : '0');
                    var newValue = data.total_clicks_your;
                    if (newValue && value != newValue) {
                        var clicksAnim = new CountUp(clicksCell[0], value, newValue, 0, 1, options);
                        clicksAnim.start();
                    }
                    options = {  
                        prefix: '$'
                    };
                    value = numeral().unformat(revenueCell.text() !== '' ? revenueCell.text() : '0');
                    newValue = cpcCell.html() * data.total_clicks_your;
                    if (newValue && value != newValue) {
                        var revenueAnim = new CountUp(revenueCell[0], value, newValue, 2, 1, options);
                        revenueAnim.start();
                    }
                    // check to see if this row is still visible, if so, continue loop
                    var displayedRows = linksDatatable.rows({
                        selected: true
                    }).data();
                    if (_.findWhere(displayedRows, {
                            0: hash
                        })) {
                        // Some random amount of time so our API calls aren't all happening at the exact same time
                        var fuzz = Math.floor(Math.random() * 1000);
                        // Refresh loop for this link
                        window.setTimeout(refreshClicks, 8000 + fuzz, hash, partner_id);
                    }
                }
            });

        }
    };

    function isPublisher() {
        return /publisher/.test(user.role);
    }

    function isAdmin() {
        return /admin-role/.test(document.body.className);
    }

    /**
     * Assign a score to a publisher
     * @return Object publisher -> score
     */
    var mapPublisherToScore = function () {
        var publishers = _(feed.sites),
            scores = _(publishers).pluck('score').map(function (score) {
                return toLetterGrade(parseInt(score));
            }).value();
        return _.object(_.pluck(publishers, 'name'), scores);
    };

    /**
     * Convert a score out of 100 to a letter grade
     * @param int score to be converted
     * @return String letter grade
     */
    var toLetterGrade = function (score) {
        if (score < 70) {
            return 'D';
        } else if (score < 80) {
            return 'C';
        } else if (score < 90) {
            return 'B';
        } else if (score <= 100) {
            return 'A';
        } else {
            console.warn('Warning: publisher score must be an integer');
            return 'N/A';
        }
    };

    /**
     * Authenticate the user by checking if google user is in the system
     * @param gapi.auth2 googleUser to be authenticated by the system
     * @return Promise 
     */
    var getApiKey = function (googleUser) {
        var gToken = googleUser.getAuthResponse().id_token;
        var url = API_BASE_URL + '/auth/google/token?type=id_token&access_token=' + gToken;
        var promise = $.Deferred();
        user.email = googleUser.getBasicProfile().getEmail();
        feed.search.user_email = user.email;

        return API.request(url).then(function (data) {
            //sessionStorage.setItem('tseapikey', data.token);
            apiKey = data.token;
            return promise.resolve(feed.search.token = apiKey);
        }).fail(function (xhr, ajaxOptions, thrownError) {
            return promise.reject(xhr.responseText);
        });
    };

    /**
     * Get the tseapikey
     */
    var requestApiKey = function (err) {
        console.error('Need to get the TSE API Key');
        sessionStorage.removeItem('tseapikey');
        //window.location = '/wp-login.php?loggedout=true';
    };

    /**
     * Set the sites that were retrieved from the server
     * @param JSON data retrieved containing sources from which to fetch articles from
     */
    var setSites = function (data) {
        var promise = $.Deferred();
        sourceList = data;
        var user_sites = _.pluck(feed.sites, 'id');
        activeSources = _.filter(sourceList, function (source) {
            // Publishers can see all sites they have access to, including disabled ones
            if (isPublisher()) {
                return user_sites.indexOf(source.id) > -1;
            } else {
                return source.enabled == 1 && source.hidden_from_portal == 0 && user_sites.indexOf(source.id) > -1;
            }
        });

        renderSites();
        return promise.resolve();
    };

    /**
     * Set up all the templates here
     */
    var setupTemplates = function () {
        templates.disableSwitch = _.template(document.getElementById('disable-switch-tpl').innerText);
        templates.score = _.template(document.getElementById('score-tpl').innerText);
        templates.partnerOption = _.template(document.getElementById('partner-option-tpl').innerText);
        templates.sourceOption = _.template(document.getElementById('source-option-tpl').innerText);
        templates.mtdLinkFilterCheckbox = _.template(document.getElementById('mtd-link-filter-checkbox-tpl').innerText);
        templates.copiableLink = _.template(document.getElementById('copiable-link-tpl').innerText);
    }

    /**
     * Set up event binding here
     */
    var setupEvents = function () {
        $(document.body).on('hover', '#toggle-filter', $('#toggle-filter').click);
        $(document.body).on('click', '.view-mode a', toggleViewMode);
        $('#enable-all').on('mousedown', $('#main .disabled.grid-item .toggle').click);
        $('#disable-all').on('mousedown', $('#main .grid-item:not(.disabled) .toggle').click);

        // $(config.elements.toggleSidebar).on('click', onToggleSidebar);
        $(config.elements.checkAllFilters).click(onCheckAllFilters);
        $(config.elements.checkNoFilters).click(onCheckNoFilters);

        $(document.body).on('click', config.elements.mtdLinkFilter, onMtdLinkFilter);
        $(document.body).on('click', '.post', function () {});
        $(document.body).on("click", ".info", get_info);
        $(document.body).on('click', '#hide-info-bar', toggleInfoBar);
        $(document.body).on('click', '.visibility.toggle', toggleVisibility);
        $(document.body).on('click', '#selectable li', toggleSavingMultipleArticles);
        /*
        $(document.body).on('mouseenter', '.post', showSocialPlatforms);
        $(document.body).on('mouseleave', '.post', hideSocialPlatforms);
        */
        $(document.body).on('click', '.post .network i', selectSocialPlatform);
        $(config.elements.selectedPartner).change(updateSearchSort);
        $(config.elements.sortDropdown).change(updateSortBy);
        $('li#savelinks a').click(saveSelectedLinks);
        $('#search').on('keypress blur', updateSearchTerms);

        $(document.body).on('click', '.url', function (evt) {
            return evt.stopPropagation();
        });

        $(document.body).on("click", "li#clearsave a", function () {
            clearSaved();
            document.getElementById('share-ucid').value = '';
        });

        // reflow on filter
        $('#Filters').change(function (argument) {
            $(document).foundation();
        });

        // TODO var clipper = new Clipboard('.copy-button');
        /*
        clipper.on('success', function (e) {
            e.clearSelection();
            $(e.trigger).attr('title', 'Copied!').tooltipster().tooltipster('show');
            setTimeout(function () {
                $(e.trigger).tooltipster('destroy').removeAttr('title');
            }, 2000);
        });
        */

        bindUTMTagEvents();
        bindEditArticleForm();
        bindRelatedToEvents();
    };

    /**
     * Update search terms
     * @params jQuery.Event e
     */
    var updateSearchTerms = function (e) {
        //detect enter key
        if ((event.type == "keypress" && e.which == 13) || event.type == "blur") {
            var text = $("#search").val().length > 2 ? $("#search").val() : null;
            if (searchTerm !== text) {
                text ? feed.search.text = text : delete feed.search.text;
                //if no text we want to sort by date again
                !text ? feed.search.sort = "creation_date desc" : null;
                switch (feed.view) {
                    case 'mylinks':
                        // TODO what do we do when they search for links?
                        // searchLinks(feed.search);
                        break;
                    case 'explore':
                        //Collecting the info for GTM
                        dataLayer = [{
                            'event': "GAevent",
                            'text': feed.search.text,
                            'sort': feed.search.sort,
                            'partner_id': feed.search.influencer_ids,
                            'site_ids': feed.search.site_ids
                        }];
                        searchContent(feed.search);
                        break;
                }
                searchTerm = text;
            }
        }
    };

    /**
     * Update sort by
     */
    var updateSortBy = function (argument) {
        var id = $(this).val();
        if (id == "random") {
            id = "_rand_" + parseInt(Math.random() * 10000) + " desc";
        }
        feed.search.sort = id;
        localStorage.setItem(config.storageKeys.sort, feed.search.sort);
        searchContent(feed.search);
    };

    /**
     * Save selected links
     * @param jQuery.Event e
     */
    var saveSelectedLinks = function (e) {
        e.preventDefault();
        if (!document.body.classList.contains('show-infobar')) {
            toggleInfoBar();
        }
        save_links();
        //$('#selectable li').each(deselect);
    };

    /**
     * Update the search sort
     */
    var updateSearchSort = function (argument) {
        var id = $(this).val();
        localStorage.setItem(config.storageKeys.partner, id);
        feed.selected_partner = id;
        feed.search.influencer_ids = id;
        // If we're in the My Links view, reload the list of links
        if (feed.view === 'mylinks') {
            refreshMTDTable();
        } else {
            // Otherwise, just update the highlighting of any saved posts
            showSavedArticles();
            // and deselect any selected posts
            clearSaved();
        }
    };

    /**
     * Select the social platform
     * @param jQuery.Event e
     */
    var selectSocialPlatform = function (e) {
        if (isPublisher()) {
            return false;
        }

        e.stopPropagation();

        $(this).toggleClass('selected');
        if ($(this).parents('.network').find('i').hasClass('selected')) {
            $(this).parents('.post').addClass('selected');
            $(this).parents('li').find('div.grid-item').addClass('callout');
            $(this).parents('li').addClass('selected');
        } else {
            $(this).parents('.post').removeClass('selected');
            $(this).parents('li').find('div.grid-item').removeClass('callout');
            $(this).parents('li').removeClass('selected');
        }
        toggleLinkBar();
    };

    /**
     * Hide social platforms
     */
    var hideSocialPlatforms = function () {
        if (!isPublisher() && !$(this).hasClass('selected')) {
            $(this).find(".network").stop().fadeOut(500);
        }
    };

    /**
     * Show social platforms to save for
     */
    var showSocialPlatforms = function () {
        if (!isPublisher() && !$(this).hasClass('selected') && !$(this).closest('.grid-item').hasClass('disabled')) {
            $(this).find(".network").stop().fadeIn(200);
        }
    };

    /**
     * Toggle saving multiple articles
     * @param jQuery.Event evt that triggered it
     *
     */
    var toggleSavingMultipleArticles = function (evt) {
        if (isAdmin() && $(this).find('.grid-item').hasClass('disabled')) {
            evt.preventDefault();
            evt.stopPropagation();
            return false;
        }

        if (isPublisher() && !/fa-info|fa-external-link/.test(evt.target.className)) {
            toggleVisibility.call(this, evt);
        } else {
            if (!$(event.target).is('.fa-info-circle, .fa-external-link-square')) {
                if (!$(this).hasClass('selected')) {
                    // Enable
                    $(this).addClass('selected');
                    $(this).find('div.grid-item').addClass('callout');
                    $(this).find('.post').addClass('selected');
                    $(this).find('i').addClass('selected');
                    $(this).find(".network").stop().fadeIn(200);
                } else {
                    // Disable
                    $(this).removeClass('selected');
                    $(this).find('div.grid-item').removeClass('callout');
                    $(this).find('.post').removeClass('selected');
                    $(this).find('i').removeClass('selected');
                    $(this).find(".network").stop().fadeOut(500);
                }
                toggleLinkBar();
                document.getElementById('share-ucid').value = getSelectedUcidFragment();
            }
        }
    };

    /**
     * Bind any events related to UTM Tags here
     */
    var bindUTMTagEvents = function () {
        $(document.body).on('click', config.elements.articleUtmTag, function (evt) {
            evt.stopPropagation();
        });

        $(document.body).on('click', config.elements.articleUtmButton, function (evt) {
            var $gridItem = $(this).closest('.grid-item');
            $gridItem.addClass('editing');
            evt.stopPropagation();
        });

        $('body').on('keyup', config.elements.articleUtmTag, function (evt) {
            if (evt.keyCode === 13) {
                $(this).closest(config.elements.articleTile).find(config.elements.articleUtmButton).click();
            }
        });
    };

    /*
     * Bind events related to finding related articles
     */
    var bindRelatedToEvents = function () {
        $(document.body).on('click', config.elements.articleRelated, function (evt) {
            evt.stopPropagation();
        });

        $(document.body).on('click', config.elements.articleRelated, function (evt) {
            var ucid = $(this).closest('.grid-item').data().id;
            window.open(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/?relatedto=' + ucid);
        });
    };

    /**
     * Bind events to the edit article form
     */
    var bindEditArticleForm = function () {
        // toggle showing of this form
        $(document.body).on('click', config.elements.editArticleForm, function (e) {
            e.stopPropagation();
        });

        // async update article
        $(document.body).on('change', config.elements.editArticleForm + ' input', function (e) {
            var element = e.originalEvent.target;

            switch (element.name) {
                case 'utm':
                    saveUTM(element);
                    break;
            }
        });

        // switch back to article view
        $(document.body).on('click', config.elements.updateArticleButton, function (e) {
            $(this).closest('.grid-item').removeClass('editing');
            e.stopPropagation();
        });
    };

    /**
     * Save the UTM tag
     * @param Element element containing the UTM tags to save
     */
    var saveUTM = function (element) {
        if (isValidURIParams(element)) {
            var utm = element.value;
            API.saveUTM(element.dataset.ucid, {
                utm: utm
            });
        } else {
            var $panel = $(element).closest('.grid-item');
            $panel.addClass('has-utm-error');
            var tmp = element.value;
            $(element).val('Invalid UTM entered');
            setTimeout(function () {
                $(element).val(tmp);
                $panel.removeClass('has-utm-error');
            }.bind(this), 1500);
        }
    };

    /**
     * Check if uri params is valid
     * @param Element element the input text field
     */
    var isValidURIParams = function (element) {
        return element.value === '' ? true : new RegExp(element.pattern).test(element.value);
    };

    /**
     * Articles DataTable
     * ---------------------------------------------------
     */
    var articlesTableAPI, // The DataTable API
        recentlyToggledArticles = [],
        mapUcidToRowIndex = {},
        toggleArticleRequestQueues = {
            enabled: [],
            disabled: []
        },
        requestWaitTime = 5000; // in milliseconds

    var setArticleTo = {
        enabled: _.debounce(function () {
            markAs('enabled');
        }, requestWaitTime),
        disabled: _.debounce(function () {
            markAs('disabled');
        }, requestWaitTime)
    };

    /**
     * Based on the action, call the corresponding endpoint and modify the appropriate queue
     * @param String action to perform is either enable/disable
     */
    var markAs = function (action) {
        var ids = toggleArticleRequestQueues[action];
        if (ids.length < 1) return false; // skip because we didn't make changes

        var url = API_BASE_URL + '/articles/mark-' + action + '?ids=' + ids.join(','),
            req = {
                token: apiKey
            };

        // Make the request to toggle articles
        API.request(url, req, 'post').then(function (response) {
            if (response[0]._settledValue.adds < ids.length) {
                revertArticleState(ids, action);
            }
        }.bind(this)).fail(function (error) {
            console.error('Error: Could not complete toggling the articles for ' + ids.join(','), error);
            revertArticleState(ids, action);
        }.bind(this));

        toggleArticleRequestQueues[action] = []; // reset the queue
    };

    /**
     * Revert a set of articles to its previous state
     * Use this when a request fails
     * @param Array articleIds that have failed to complete a request
     * @param String action of the request; so the action to revert is the opposite
     */
    var revertArticleState = function (articleIds, action) {
        articleIds.map(function (id) {
            $('#selectable .article[data-id="' + id + '"] .grid-item').toggleClass('disabled'); // assume that it was already toggled before, we just toggle it back
            return _.findWhere(feed.articles.data, {
                id: id
            });
        }).forEach(function (article) {
            setRowData(article, action === 'enabled' ? ['0'] : ['1']); // set the opposite
        });
    };

    /**
     * Toggle view modes from grid to tables
     */
    var toggleViewMode = function () {
        $('.view-mode.active').removeClass('active');
        var $button = $(this).closest('.view-mode');
        $button.addClass('active');
        var viewMode = $button.data('mode');
        document.body.classList.toggle('table-mode', /table/.test(viewMode));
        localStorage.setItem(config.storageKeys.mode, viewMode);
    };

    /**
     * Toggle an article
     * @param Element articleElement that was clicked
     * @return Function that is rate limited
     */
    var toggleDisabledArticle = function (articleElement) {
        var articleId = articleElement.dataset.id,
            disableArticle = $(articleElement).toggleClass('disabled').hasClass('disabled'), // fade out article
            article = _.findWhere(feed.articles.data, {
                id: articleId
            }),
            enabled = disableArticle ? ['0'] : ['1'];

        if (typeof article !== 'undefined') {
            setRowData(article, enabled);

            var previousQueue = toggleArticleRequestQueues[disableArticle ? 'enabled' : 'disabled'], // Check if the article is already queued up for any request
                indexInQueue = previousQueue.indexOf(articleId);

            if (indexInQueue > -1) { // If it is queued
                previousQueue.splice(indexInQueue, 1); // unqueue it because this request is actually reverting it back to its original state
            } else {
                toggleArticleRequest(!disableArticle, articleId); // Make the request
            }
        }

    };

    /**
     * Get the Month-to-Date totals for shared links
     * @param String role is either influencer or publisher
     * @param int id of user to fetch
     * @return jQuery Promise
     */
    var getMTDTotalLinksShared = function (role, id) {
        var reqData = {
            token: apiKey,
            timestamp_start: feed.search.timestamp_start || moment().startOf('month').startOf('day').format(),
            timestamp_end: feed.search.timestamp_end || moment().endOf('month').endOf('Day').format(),
            include_fb: false
        };

        //timestamp_start: moment().subtract(1, 'years').startOf('month').format('YYYY-MM-DD HH:mm:ss')
        //timestamp_start: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')
        reqData[role.replace(/s$/, '_id')] = id;
        $(config.elements.loadingIcon).removeClass('hide');
        return API.getMTDTotalLinksShared(role, reqData);
    };

    /**
     * Process the shared links MTD 
     * @param Object res is the JSON data the server responded with
     */
    var displayMTDTable = function (res) {

        // We're going to format the output slightly differently for publishers and other users
        if (user.role !== 'publisher') {
            feed.mtdLinks = feed.mtdLinks.concat(buildLinksInfluencer(res));
        } else {
            feed.mtdLinks = feed.mtdLinks.concat(buildLinksPublisher(res));
        }

        displayAggregatedStats(feed.mtdLinks, aggregateStats(feed.mtdLinks));

        // display sidebar counters
        showCountersFor(feed.mtdLinks, 'site_name', config.elements.sitesList);
        showCountersFor(feed.mtdLinks, 'platform', config.elements.platformsList);

        // Display data table
        $(config.elements.mtdLinkTable).DataTable({
            dom: '<"toolbar grid-block"<"grid-content"l><"grid-content"fT>>rt<"toolbar grid-block"<"grid-content"i><"grid-content"p>>',
            tableTools: {
                "sSwfPath": "//cdn.datatables.net/tabletools/2.2.0/swf/copy_csv_xls_pdf.swf",
                "aButtons": [{
                    "sExtends": "copy",
                    "oSelectorOpts": {
                        filter: "applied",
                        order: "current"
                    }
                }, "csv", "xls", {
                    "sExtends": "pdf",
                    "sPdfOrientation": "landscape"
                }]
            },
            pageLength: localStorage.getItem(config.storageKeys.pageLength) || 50,
            destroy: true,
            data: feed.mtdLinks,
            order: [
                3, 'desc'
            ],
            columnDefs: [{
                width: '8rem',
                targets: 2
            }],
            columns: [{
                    title: 'Title',
                    data: 'title',
                }, {
                    title: 'Site',
                    data: 'site_name'
                }, {
                    title: 'URL',
                    className: 'hide-publisher-role',
                    data: 'shortlink',
                    render: function (data, type, row) {
                        if (type !== 'display') return data;
                        var opts = {
                            url: data.replace("http://", ""),
                            target: 'shortlink-' + row.hash
                        };

                        return templates.copiableLink(opts);
                    }
                }, {
                    title: 'Clicks',
                    data: 'total_clicks',
                    render: function (data, type) {
                        if (type !== 'sort') return addCommas(data);
                        return data;
                    }
                }, {
                    title: 'CPC',
                    data: 'cpc',
                    render: function (data, type) {
                        if (type !== 'display') return data;
                        return toCurrency(data, 4);
                    }
                }, {
                    title: user.role === 'publisher' ? 'Cost' : 'Revenue',
                    data: 'cost',
                    render: function (data, type) {
                        return type === 'display' ? toCurrency(data) : data;
                    }
                },
                /*
                {
                    title: 'Shares',
                    data: 'shares_number'
                },
                */
                {
                    title: 'Saved',
                    className: 'hide-publisher-role',
                    data: 'saved_date',
                    render: function (data, type) {
                        if (type !== 'display') return data;
                        return moment(data).format('MM/DD/YYYY HH:mm');
                    }
                }
            ]
        });

        $(config.elements.loadingIcon).addClass('hide');
    };

    /**
     * Construct MTD links for publisher
     * @param Object res contains info on links, articles, and sites from the server's response
     * @return Array of MTD link objects
     */
    var buildLinksPublisher = function (res) {
        return _.chain(res.links).map(function (link) {
            // Connect article and site data to this link
            link.article = _.findWhere(res.articles, {
                ucid: link.ucid
            });

            link.site = _.findWhere(res.sites, {
                site_id: link.site_id
            });

            if (!!link.article && !!link.site) {
                // Select attributes for the link object
                link = _.chain(link).pick('link', 'hash', 'total_clicks', 'saved_date').extend({
                    title: link.article.title,
                    url: link.article.url,
                    site_name: link.site.site_name,
                    cost: link.site.cpcs[link.site.cpcs.length - 1].value * link.total_clicks,
                    shares_number: link.article.shares_number,
                    cpc: link.site.cpcs[link.site.cpcs.length - 1].value,
                    platform: feed.platforms.names[link.platform_id],
                    shortlink: 'qklnk.co/' + link.hash
                }).value();

                return link;
            }

            return null;
        }).compact().value();
    };

    /**
     * Construct MTD links for influencer
     * @param Object res contains info on links from the server's response
     * @return Array of MTD link objects
     */
    var buildLinksInfluencer = function (res) {
        return _.chain(res.links).map(function (link) {

            // Select attributes for the link object
            link = _.chain(link).pick('link', 'hash', 'total_clicks', 'saved_date', 'title', 'site_name', 'cost', 'cpc').extend({
                platform: feed.platforms.names[link.platform_id],
                shortlink: 'qklnk.co/' + link.hash
            }).value();

            return link;

        }).compact().value();
    }

    /**
     * Aggregate stats for a set of links
     * @param Array links that we'll be calculating stats from
     * @return Object containing the aggregated data
     */
    var aggregateStats = function (links) {
        var stats = {
            totalClicks: _.reduce(links, function (sum, link) {
                return sum + parseInt(link.total_clicks);
            }, 0),
            estimatedCost: _.reduce(links, function (sum, link) {
                return sum + parseFloat(link.cost);
            }, 0),
        };

        stats.avgCPC = stats.estimatedCost / stats.totalClicks || 0;
        return stats;
    };

    /**
     * Display aggregated stats to the My Stats tab for Publisher
     * @param Array links that stats is taken from 
     * @param Object stats containing the info we need
     */
    var displayAggregatedStats = function (links, stats) {
        $(config.elements.aggregatedCostOrRevenue).text(user.role === 'publisher' ? 'COST' : 'REVENUE');
        $(config.elements.totalClicks).text(addCommas(stats.totalClicks));
        $(config.elements.estimatedCost).text(toCurrency(stats.estimatedCost));
        $(config.elements.avgCPC).text(toCurrency(stats.avgCPC, 4));
    };

    /**
     * Sum up the values of the list elements specified by the property and output each list item
     * @param Array list to iterate through
     * @param String property that stores the Number that will be summed up
     * @param jQueryElement output is where all the list elements will be appended to. Note that previous elements will be cleared
     */
    var showCountersFor = function (list, property, output) {
        var listItems = _.countBy(list, property);
        $(output).empty().append(buildCounterListItems(listItems, property));
    };

    /**
     * Return a string representation of HTML List Elements
     * @param Object obj an object where key is label and value is the counter
     * @param String property distinguishes one group of filters from another (ie. sites and platforms)
     * @return String list element should be appended to a list element
     */
    var buildCounterListItems = function (obj, property) {
        return _.chain(obj).keys()
            .map(function (key) {
                return {
                    label: key,
                    count: obj.value()[key]
                };
            })
            .sortBy(function (obj) {
                return obj.count;
            })
            .reverse()
            .reduce(function (memo, obj) {
                var lowercased = obj.label.toLowerCase(),
                    tag = 'check-' + lowercased;

                var data = {
                    id: 'filter-' + lowercased,
                    label: obj.label,
                    count: obj.count,
                    name: property
                };

                return memo + templates.mtdLinkFilterCheckbox(data);
            }, '');
    };

    /**
     * Return an array of article's values given a set of keys in the arguments
     * @param Object article single item we're looping through that we need to fetch values from
     * @return Array of just the values for the keys
     */
    function getArticleKeys(article) {
        var values = [];
        article = _.pick(article, 'creation_date', 'title', 'url', 'ucid');

        values.push(Array.isArray(article.creation_date) ? article.creation_date.join('') : article.creation_date);
        values.push(Array.isArray(article.title) ? article.title.join('') : article.title);
        values.push(Array.isArray(article.url) ? article.url.join('') : article.url);
        values.push(Array.isArray(article.ucid) ? article.ucid.join('') : article.ucid);

        return values;
    }

    /**
     * Update the list of articles
     * @param Array articles that will replace what's stored on feed.articles.data
     * @return Array new feed.articles.data
     */
    function updateArticles(newValue) {
        sanitize(newValue);
        feed.articles.data = newValue;
        feed.articles.list = _(feed.articles.data).pluck('fields').map(getArticleKeys).value();

        if (typeof articlesTableAPI === 'undefined') {
            initializeArticlesTable();
        } else {
            mapUcidToRowIndex = {};
            articlesTableAPI.clear().rows.add(feed.articles.list).draw();
        }
    }

    /**
     * Initialize the articles data table
     */
    function initializeArticlesTable() {
        var columnDefs = [
        {
            title: 'Created At',
            className: 'th-created-at',
            width: '7rem',
            render: function (data, type, full, meta) {
                return type === 'display' ? moment.utc(data, 'YYYY-MM-DD[T]HH:mm:ss[Z]').local().format("MM/DD/YYYY h:mma") : data;
            }
        }, {
            title: 'Title',
            className: 'td-title',
            render: function (data, type) {
                return type === 'display' ? '<span>' + data + '</span>' : data;
            }
        }, {
            title: 'URL',
            width: '15rem',
            className: 'td-url',
            render: function (data, type, full, meta) {
                var url = data.replace('http://', ''),
                    display = '<a href="[data]" target="_blank" class="tooltips">[url]</a>';

                return type === 'display' ? display.replace('[data]', data).replace('[url]', url) : data;
            }
        }];

        if (/admin|publisher/.test(user.role)) {
            columnDefs.push({
                title: 'Disabled?',
                width: '2.5rem',
                render: function (data, type, full, meta) {
                    var article = _.find(feed.articles.data, {
                        id: data
                    });
                    if (!/display|sort/.test(type) || typeof article === 'undefined') return data;

                    var isDisabled = !isEnabled(article.fields.enabled);
                    switch (type) {
                        case "display":
                            mapUcidToRowIndex[data] = meta.row;
                            return templates.disableSwitch({
                                ucid: data,
                                isDisabled: isDisabled
                            });
                        case "sort":
                            return isDisabled;
                    }
                }
            });
        }

        articlesTableAPI = $('#articleTable').DataTable({
            dom: '<"toolbar grid-block"<"grid-content"l><"grid-content"fT>>rt<"toolbar grid-block"<"grid-content"i><"grid-content"p>>',
            pageLength: localStorage.getItem(config.storageKeys.pageLengthExplore) || 50,
            data: feed.articles.list,
            columns: columnDefs
        });

        articlesTableAPI.on('length', function (evt, settings, newValue) {
            localStorage.setItem(config.storageKeys.pageLengthExplore, newValue);
        });
    }

    /**
     * Update the article's data on the client-side
     * @param Object article to update
     * @param Array enabled contains the value for the article's enabled property */
    function setRowData(article, enabled) {
        var row = $('#articleTable').DataTable().row(mapUcidToRowIndex[parseInt(article.id)]);
        article.fields.enabled = enabled;
        row.data(row.data()); // render()
    }

    /**
     * Event handler for toggling an article's visibility status
     * @param Event evt that was triggered
     */
    function toggleVisibility(evt) {
        if (isPublisher() || isAdmin()) {
            var articleId = this.dataset.id;
            toggleDisabledArticle(document.querySelector('.article[data-id="articleId"]'.replace('articleId', articleId)));
            return evt.stopPropagation();
        }
    }

    /**
     * Check if an article's enabled property is true
     * use this because the property has mixed values
     * Note: This will only return true if the
     * @param mixed enabled may be an array, boolean, or int
     * @return bool
     */
    function isEnabled(enabled) {
        return !!Array.isArray(enabled) && enabled.length === 1 ? parseInt(enabled[0]) : enabled;
    }

    /**
     * Request to enable/disable an article
     * Push the article id to the correct request queue
     * @param bool enable determines which queue to place the article id into
     * @param int article id
     */
    function toggleArticleRequest(enable, article) {
        var action = enable ? 'enabled' : 'disabled';
        toggleArticleRequestQueues[action].push(article);
        setArticleTo[action]();
    }

    /**
     * Converts a number (float) to a fixed precision with commas every thousandth place
     * @param Number number to convert
     * @param Number precision how many places to the right of the decimal point to show
     * @return Number that has commas and fixed to 2 numbers after the decimal
     */
    function toCurrency(number, precision) {
        return '$' + number.toFixed(precision || 2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }

    /**
     * Add commas to large numbers
     * @param Number/String num to add commas to
     * @return String num with commas added
     */
    function addCommas(num) {
        return num.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
    }

    /**
     * Show/Hide sidebar
    var onToggleSidebar = function () {
        var isSidebarVisible = $('body').toggleClass('hide-sidebar').hasClass('hide-sidebar'),
            gridCountModifier = isSidebarVisible ? 1 : -1,
            gridClassName = $(config.elements.grid).attr('class').replace(/\d+/g, function (num) {
                return parseInt(num) + gridCountModifier;
            });

        $(config.elements.grid).attr('class', gridClassName);
    };
     */

    /**
     * Filter the rows on the MTD links datatable based on the filters (ie. sites and platforms)
     */
    var onMtdLinkFilter = function () {
        var filters = getColumnFiltersFor($(config.elements.statsFilterGroup)),
            links = applyColumnFiltersToRows(filters, feed.mtdLinks);

        $(config.elements.mtdLinkTable).DataTable().clear().rows.add(links).draw();
        displayAggregatedStats(links, aggregateStats(links));
    };

    /**
     * Returns an object where the key maps to an object attribute and value is an array of accepted values
     * Use this for data table
     * @param jQueryElements filterGroups is an array of container elements wherein each represents a column to filter through
     * @return Object where key maps to a column name and value is the set of accepted values for that filtered column
     */
    var getColumnFiltersFor = function (filterGroups) {
        var filterGroups = _.groupBy(filterGroups, function (el) {
            return el.dataset.attribute;
        });

        for (var group in filterGroups) {
            filterGroups[group] = _.map($(filterGroups[group]).find('input:checked'), function (el) {
                return el.value;
            });
        }

        return filterGroups;
    };

    /**
     * Filter an array of objects/rows given a filter object
     * @param Object filters to apply to rows wherein the key is the column to filter and value is the set of accepted values
     * @param array rows to apply the filters to
     * @return array is a subset of rows after the filter is applied
     */
    var applyColumnFiltersToRows = function (filters, rows) {
        return _.filter(rows, function (row) {
            for (var filter in filters) {
                if (!_(filters[filter]).contains(row[filter])) {
                    return false;
                }
            }
            return true;
        });
    };

    /**
     * Click on all the filters within a stats filter group
     * @param Element this is the link that was clicked
     */
    var onCheckAllFilters = function () {
        $(this).closest(config.elements.statsFilterGroup).find('input:not(:checked)').click();
    };

    /**
     * Uncheck all filters within the same group
     * @param Element this is the link that was clicked
     */
    var onCheckNoFilters = function () {
        $(this).closest(config.elements.statsFilterGroup).find(':checked').click();
    };

    /**
     * Check if the device is mobile
     * @return bool if device is mobile
     */
    var isMobile = function () {
        return !!navigator && 'userAgent' in navigator && /android|blackberry|iphone|ipad|ipod|opera mini|iemobile/i.test(navigator.userAgent);
    };

    /**
     * Get a query string parameter by name.
     */
    var getParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    /**
     * Generate an uri fragment for the current selected posts
     * @return String uri fragment
     */
    var getSelectedUcidFragment = function () {
        var ucids = $('.selected.post').map(function () {
            return $(this).closest('.grid-item').data('id');
        });
        return window.location.protocol + '//' + window.location.hostname + '/?ucid=' + [].join.call(ucids, ',');
    };

    var renderButton = function () {
        gapi.signin2.render('g-signin2', {
            scope: 'profile email',
            width: 'auto',
            height: '31px',
            longtitle: false,
            theme: 'light',
            onsuccess: onSignIn,
            onfailure: onSignInFailure
        });
    };

    var loadContent = function () {
        feed.view = 'explore';
        // $("#reportrange + button").show();
        // $('#linkTable_wrapper').hide();
        $('#container').css("padding-right", "15%");
        //$('.explore-only').show();
        // $('#source-row').show();
        searchContent(feed.search);
    };


    // Only make these methods available
    return {
        initialize: initialize
    };
})();

var mainApp = (function () {

    /**
     * Will use eventually when we have routing eintegrated
     */
    var mainApp = angular.module('application', [
            'ui.router',
            'ngAnimate',

            //foundation
            'foundation',
            'foundation.dynamicRouting',
            'foundation.dynamicRouting.animations'
        ])
        .config(appConfig)
        .run(run);

    appConfig.$inject = ['$urlRouterProvider', '$locationProvider'];

    function appConfig($urlProvider, $locationProvider) {
        $urlProvider.otherwise('/');

        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });

        $locationProvider.hashPrefix('!');
    }

    function run() {
        FastClick.attach(document.body);
    }


    return mainApp;

})();

$(function () {
    app.initialize();
});
