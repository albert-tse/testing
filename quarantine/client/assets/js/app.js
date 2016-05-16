var exploreApp = (function() {
    'use strict';

    var articleElements = {};

    $.fn.foundation = function() {
        return;
    };

    var initialize = function() {
        // Prepare DOM Components
        setupTemplates();
        setupEvents();
        initStatsDateRangePicker();
        checkAuth();

        document.body.classList.toggle('is-mobile', isMobile());
    };

    var checkAuth = function() {
        var authState = altHack.auth.store.getState();
        if (authState.isAuthenticated && authState.token) {
            $(document.body).addClass('signed-in');
            apiKey = authState.token;
            user.email = feed.search.user_email;

            initFeed().then(setSites)
                .then(filterContent);
        }
    }

    var filterContent = function() {
        var promise = $.Deferred();

        // Check to see if we're linking to specific set of UCID's
        var ucids = getParameterByName('ucid');

        if (/trending/.test(window.location.hash)) {
            feed.search.trending = true;
        }

        if (/recommended/.test(window.location.hash)) {
            feed.search.relevant = true;
        }

        if (ucids) {
            var allDates = true;

            // Show a message that the current results are limited to a specific list of articles
            $('.articleFilterMessage').show();

            // Bind click handler to remove article filter
            $('.clearArticleFilter').on('click', function() {
                removeArticleFilterParams();
            });

            feed.search.ucids = ucids;
            feed.search.skipDate = true;
            loadInitial();
            promise.resolve();

        } else {
            feed.search.skipDate = false;
            $('.articleFilterMessage').hide();
            loadInitial();
            promise.resolve();
        }

        return promise;
    };

    /**
     * Initialize the feed before loading any articles
     */
    var initFeed = function() {
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


        if (altHack.list.store.getSavedList().isLoading) { //If we don't have a saved list, load it
            altHack.list.actions.getSavedList();
        }

        return $.when(
            API.request(API_BASE_URL + '/users/me'), // get user info
            API.request(API_BASE_URL + '/platforms')
        ).then(function(user, platforms) { // XXX not sure why each returns an argument list
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
    var deselect = function(index) {
        if ($(this).hasClass('selected')) {
            // Disable
            $(this).removeClass('selected');
            $(this).find('div.grid-item').removeClass('callout');
            $(this).find('.post').removeClass('selected');
            $(this).find('i').removeClass('selected');
            $(this).find(".network").stop().fadeOut(500);
        }
    };

    var clearSaved = function() {
        $(".grid-item").each(deselect);
        toggleLinkBar();
    };

    /**
     * Get the currently selected partner from web storage
     * @return string the current selected partner
     */
    var getSelectedPartner = function() {
        var selected = localStorage.getItem(config.storageKeys.partner);
        if (!_.chain(feed.partners).map('id').includes(selected).value()) {
            selected = $(config.elements.firstPartner).val();
        }

        return selected;
    };

    var formatNum = function() {
        $(".numFormat").each(function(index, value) {
            var str = $(this).text();
            //if not already called call it. usefull for dynamic loading
            if (str.indexOf(",") == -1) {
                $(this).html(numeral(str).format('0,0'));
            }
        });
    };

    var initStatsDateRangePicker = function() {
        var searchText = getParameterByName('q'); // Check for a search query in the URL, and prefill the search box if exists
        $("#search").val(feed.search.text = searchText); // Will  be blank if there is none
        initDatePicker(searchText); // If true, the date picker will default to "All Time". This is useful if searching for a specific URL, for example.
    };

    var initDatePicker = function(allTime) {
        $('#reportrange').daterangepicker({
            verticalOffset: 20,
            presetRanges: [{
                text: 'Today',
                dateStart: function() {
                    return moment();
                },
                dateEnd: function() {
                    return moment();
                }
            }, {
                text: 'Last 7 Days',
                dateStart: function() {
                    return moment().subtract(6, 'days');
                },
                dateEnd: function() {
                    return moment();
                }
            }, {
                text: 'Last 30 Days',
                dateStart: function() {
                    return moment().subtract(29, 'days');
                },
                dateEnd: function() {
                    return moment();
                }
            }, {
                text: 'All Time',
                dateStart: function() {
                    return moment().subtract(100, 'years');
                },
                dateEnd: function() {
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

        $("#reportrange").daterangepicker({
            onChange: function() {
                updateSearchDateRange();
                searchContent(feed.search);
            }
        });
    };

    // TODO confirm it is dead Code?
    var generateClientFilter = function() {
        return;
        var clients = [];
        //Find the clients loaded
        $('.client').each(function(index, value) {
            value = $(value).text();
            if ($.inArray(value, clients) == -1) {
                clients.push(value);
            }
        });
        //need to remove the client already added on a previous load
        $('.checkable').each(function(index, value) {
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
    var toggleLinkBar = function() {
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
    var toggleInfoBar = function() {
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
            adjustedColumns = [].map.call(grid.classList, function(classname) {
                return classname.replace(/\d+/, function(num) {
                    return parseInt(num) + isInfoBarVisible;
                });
            }).join(' ');

        grid.className = adjustedColumns;
    }

    // Load initial content
    var loadInitial = function() {
        var initialViewMode = localStorage.getItem(config.storageKeys.mode) || 'grid';
        $(config.elements.viewMode.replace(/value/, initialViewMode)).click();
        publisherIds = _.map(activeSources, 'id');
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

        loadContent(feed.search);

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

    };

    var updateSearchDateRange = function() {
        var value;

        try {
            value = $("#reportrange").daterangepicker("getRange");
        } catch (e) { // daterange picker not initialized
            initDatePicker();
            value = $("#reportrange").daterangepicker("getRange");
        }

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
    var compare = function(a, b) {
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
    var renderSites = function() {
        var sortedSites = activeSources.sort(compare);
        _.each(sortedSites, function(site) {
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
            onClose: function(view) {
                var selected = $('#source').multipleSelect("getSelects"),
                    id = selected.toString(),
                    _oldSelected = feed.search.site_ids;

                selected.length > 0 ? feed.search.site_ids = id : feed.search.site_ids = feed.site_ids;
                localStorage.setItem(config.storageKeys.sites, JSON.stringify(selected));

                // Search for either content or links data depending on which tab we're currently in
                if (_oldSelected !== feed.search.site_ids) {
                    searchContent(feed.search);
                }
            }
        }).multipleSelect('setSelects', getSelectedSitesFromStorage());
    };

    /**
     * Get the selected sites from the session
     * @return array of site ids || null
     */
    var getSelectedSitesFromStorage = function() {
        var sites = JSON.parse(localStorage.getItem(config.storageKeys.sites)) || [],
            available = getAllAvailableSites();

        return _.intersection(sites, available).length > 0 ? _.intersection(sites, available) : available;
    };

    /**
     * Get the site ids of all the sites available
     * @return array of site ids || empty array
     */
    var getAllAvailableSites = function() {
        return $(config.elements.sourceOptions).map(function() {
            return this.value;
        });
    };

    /**
     * Set the user info
     * @param Object user to update
     */
    var updateUser = function(userData) {
        user = userData;
        updatePartners(userData.influencers);
        document.body.classList.add(user.role + '-role');
    };

    /**
     * Set the sites data
     * @param Array sites to add to list
     */
    var updateSites = function(sites) {
        feed.sites = sites;
        feed.scoreMap = mapPublisherToScore();
    };

    /**
     * Update the partners list
     * Use this method whenever the partners data has to be changed
     * Add any functions that should be called upon changing feed.partners here
     * @param Array partners new value
     */
    var updatePartners = function(influencers) {
        feed.partners = influencers;
        generatePartners(); // Reset dropdown menu
    };

    /**
     * Update the platforms list
     * This will be used to map platform ids to names
     * @param Object platforms
     */
    var updatePlatforms = function(platforms) {
        feed.platforms = platforms;
        feed.platforms.names = [];
        for (var i = 0; i < feed.platforms.data.length; i++) {
            feed.platforms.names[feed.platforms.data[i].id] = feed.platforms.data[i].name;
        }
    };

    /**
     * Populate Partner pulldown for user
     */
    var generatePartners = function() {
        var dropdownMenu = document.getElementById('partner'),
            menuHTML = '';

        var ids = _.chain(feed.partners).sortBy(function(partner) {
            return partner.name.toLowerCase();
        }).map(function(partner) {
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
    var insertContentToGrid = function(posts) {
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
                articleElements[elem.ucid] = post;
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
                // post.find('.visibility').get(0).dataset.id = elem.ucid;
                post.toggleClass('disabled', ('enabled' in elem && 'length' in elem.enabled && elem.enabled[0] === '0') || !('enabled' in elem)); // disable article if '0' or is not set

                // utm article
                var $utm = post.find(config.elements.articleUtmField);
                $utm.get(0).dataset.ucid = elem.ucid;
                if ('utm' in elem) {
                    $utm.val(elem.utm);
                }

                // Attach metadata to each social share button
                post.find('.social-btn').each(function(index, btn) {
                    var metadataParams = Object.keys(btn.dataset); // these are the metadata we want to pass to the social button
                    metadataParams.forEach(function(metadata) {
                        if (metadata in elem && !/platform/.test(metadata)) {
                            btn.dataset[metadata] = elem[metadata].join(); // using join because the value is an array
                        } else if (metadata === 'platform') {
                            var platform = btn.dataset[metadata];
                            btn.dataset.platformUrl = config.shareURLs[platform];
                        }
                    });
                });
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
    var refreshContent = function(posts, callback) {
        $(config.elements.grid).empty();
        posts.length === 0 ? $('.noResultsMessage').show() : $('.noResultsMessage').hide(); // If we didn't find any posts, display a message to the user
        insertContentToGrid(posts);
        callback();
    };


    /**
     * Render the integer with commas when displaying
     * @param Object data to render
     * @param String type of action to take ie. display and sort
     * @param Object full 
     * @param Object meta
     * @return String formatted integer with commas added to every thousands group
     */
    var withCommas = function(data, type, full, meta) {
        return type === 'display' ? numeral(data).format('0,0') : data;
    };
    /**
     * Turn the article into green if saved for selected partner
     */
    var showSavedArticles = function() {
        var savedList = altHack.list.store.getSavedList();

        if (!savedList.isLoading) {
            var savedArticles = savedList.articles;
            $('.grid-block .container .article.grid-item')
                .each(function() {
                    var ucid = $(this).attr('data-id');
                    var isSaved = _.find(savedArticles, function(el) {
                        return el.ucid == ucid;
                    });

                    $(this).find('.save-article').removeClass('fa-spin');
                    if (isSaved == undefined) {
                        $(this).removeClass('saved');
                        $(this).find('.save-article').removeClass('mdl-button--accent');
                        $(this).addClass('not-saved');
                        $(this).find('.save-article i').text('bookmark_border');
                    } else {
                        $(this).removeClass('not-saved');
                        $(this).addClass('saved');
                        $(this).find('.save-article').addClass('mdl-button--accent');
                        $(this).find('.save-article i').text('bookmark');
                    }
                });
        }
    };

    /**
     * search content from the selected sites, text and actives partners will call generateInitArticles to make the html
     * TODO: Instead of relying on whatever filters we have to modify feed.search in event handlers, we should check the status of
     * those filters here and build the search query before sending it.
     */
    var searchContent = function(obj, callback) {
        blockUI();
        $('#selectable').empty();
        var userStore = altHack.user.store.getState();
        obj.site_ids = userStore.selectedSites.join();
        API.request(API_BASE_URL + '/articles/search', obj).then(updateFeed);
    };

    var searchMoreContent = function(obj, cursor, callback) {
        if (feed.articles.more < 1) {
            return;
        }

        var obj = obj || feed.search;
        var cursor = cursor || feed.articles.cursor;
        var callback = callback || function(err, posts) {
            feed.articles.more = (parseInt(posts.hits.found) - parseInt(posts.hits.start)) - posts.hits.hit.length;
            feed.articles.cursor = posts.hits.cursor;
            updateArticles(feed.articles.data.concat(posts.hits.hit));
            appendContent(posts.hits.hit);
        };

        var query = jQuery.extend(true, {}, obj);
        query.cursor = cursor;
        API.request(API_BASE_URL + '/articles/search', query).then(function(posts) {
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
    var blockUI = function() {
        $.blockUI({
            message: '<div class="loader legacy-blockui-loader"> <svg class = "circular" > <circle class = "path" cx = "50" cy = "50" r = "20" fill = "none" stroke - width = "2" stroke - miterlimit = "10" /> </svg> </div>',
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
    var logError = function(data, xhr) {
        log(data);
        log(xhr);
    };

    /**
     * Set defaults here so we don't get DataTable errors
     * @param array posts to sanitize
     */
    var sanitize = function(posts) {
        _.each(posts, function(post) {
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
    var updateFeed = function(posts) {
        if (typeof posts.status == 'object') {
            feed.articles.more = (parseInt(posts.hits.found) - parseInt(posts.hits.start)) - posts.hits.hit.length;
            feed.articles.cursor = posts.hits.cursor;
            feed.articles.found = posts.hits.found;
            var postsContent = posts.hits.hit;
            updateArticles(postsContent);
            posts.hits.hasOwnProperty('saved') ? feed.articles.stats = posts.hits.saved : null;
            posts.hits.hasOwnProperty('shared') ? feed.articles.shared = posts.hits.shared : null;
            refreshContent(feed.articles.data, function() {
                $.unblockUI();
            });
        } else {
            log('nope');
            alert('client delete connection error');
        }
    };

    var log = function(x) {
        console.log(x);
    };

    var getSourceName = function(site_id) {
        var site = _.find(sourceList, function(site) {
            return site.id == site_id;
        }) || {
            name: 'Unknown'
        };
        return site;
    };

    var appendContent = function(posts) {
        insertContentToGrid(posts);
    };

    /**
     * Download the images in the background before displaying them to the DOM
     * @param String src points to the image URL
     * @param Element img we need to put the loaded image on
     */
    var preloadImage = function(src, img) {
        var loader = new Image();
        img.dataset.src = src;
        loader.src = src;
        loader.onload = imageLoaded.bind(img); // Note: we just want to be notified when it's loaded so we don't use the Element from loader
    };

    /**
     * Once image is loaded, update the Element's src attribute to display it
     */
    var imageLoaded = function() {
        this.classList.add('loaded');
        this.src = this.dataset.src;
    };

    //SAVE LINK
    var save_links = function() {
        var dataAjax = [];
        $('#info-bar .title').hide();
        $('#info-bar .source').hide();
        $("#feedStats").html(statsTable);
        $('li.selected').each(function(argument) {
            var post = $(this);
            var plats = post.find('.post i.selected');
            plats.each(function(i) {
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
        async.each(dataAjax, function(obj, callback) {
            // Perform operation on file here.
            log('Processing data ', obj.data);
            var data = obj.data;
            var post = obj.post;
            API.request(API_BASE_URL + '/links', data, 'post').then(function(msg) {
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

        }, function(err, msg) {
            showSavedArticles();
            // if any of the file processing produced an error, err would equal that error
            if (err) {
                // One of the iterations produced an error.
                // All processing will now stop.
                console.error('error ', err);
            } else {
                $(".grid-item").each(deselect);
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

    var hasStats = function(ucid) {
        j = getSaved(ucid);
        if (_.some(j, function(o) {
                return _.has(o, "stats");
            })) {
            return true;
        } else {
            return false;
        }
    };
    var getSharedNumber = function(ucid) {
        var saved = getSaved(ucid);
        var categories = _.countBy(saved, function(obj) {
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
    var getSaved = function(ucid) {
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
    var getSavedArray = function(ucids) {
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

    var get_info = function(event) {
        var ucid = $(this).attr('ucid');
        /*
        if (ucid == $('#info-bar').attr('data-id') || !document.body.classList.contains('show-infobar')) {
            toggleInfoBar();
        }
        */

        var target = $(event.target),
            savedInfo = getSaved(ucid),
            title = target.closest('.grid-item').find('.title').text(),
            site = target.closest('.grid-item').find('.sitename').text(),
            info,
            headline = {
                "title": title,
                "site": site
            };

        var formatedInfo = [];

        if (savedInfo.length > 0) {
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
            // appendInfoSideBar(headline, formatedInfo);
        } else {
            $('#info-bar').attr('data-id', ucid);
            $('#info-bar .title').text(headline.title);
            $('#info-bar .source').text(headline.site);
            $("#feedStats").text("Sorry, no stats are available for this article :(");
        }

        var article = _.find(feed.articles.data, {
            id: ucid
        });

        var performance = article.performance;
        if (performance) {
            $("#feedStats").append("<br> Performance Data: <br>");
            $("#feedStats").append(JSON.stringify(performance, null, 2));
        }

        return {
            title: headline.title,
            site: headline.site,
            stats: formatedInfo,
            performance: performance
        };

        // $('#open-infobar').click();
    };

    /**
     * Put the info in the side bar
     * @param  {Array of object} headline
     * @param  {Array of object} formatedInfo
     */

    var appendInfoSideBar = function(headline, formatedInfo) {
        var _hasStats;
        //TODO put statsTable in an object
        $('#info-bar').attr('data-id', formatedInfo[0].ucid);
        $("#feedStats").html(statsTable);
        $('#info-bar .title').show().text(headline.title);
        $('#info-bar .source').show().text(headline.site);

        var _influencers = (_.groupBy(formatedInfo, 'partner_id'));
        _.each(_influencers, function(key, value) { // XXX key and value should be swapped here
            var _influencerGroup = _.sortBy(_influencers[value], 'platform_id');
            $('#statsBody').append("<tr><td colspan='2' style='text-align:center;'><h3>" + _.map(key, 'influencer_name')[0] + "</h3></td></tr>");
            _.each(_influencerGroup, function(key, value) {
                var theLink = 'http://qklnk.co/' + _influencerGroup[value].hash;
                $("#statsBody").append("<tr><td class='bold'>" + feed.platforms.names[_influencerGroup[value].platform_id] + "</td><td style='font-size:small;'><a href='" + theLink + "' target='_blank'>" + theLink + "</a></td></tr>");
                _hasStats = _influencerGroup[value].hasOwnProperty('stats') && _influencerGroup[value].stats.length > 0;
                if (_hasStats) {
                    var _stats = _influencerGroup[value].stats;
                    _.each(_stats, function(key, value) {
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
    var appendLinksSideBar = function(post, data, hash) {
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
    var showStatsIcon = function(post) {
        post = $(post);
        post.find(".client").append(' <i class="fa fa-bar-chart"></i>');
        post.removeClass('not-shared').addClass('shared');
    };
    var showSharedNumber = function(post, shared) {
        post = $(post);
        post.removeClass('not-shared').addClass('shared');
        post.find('.social').empty();
        _.each(shared, function(value, index) {
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
        init: function() {
            var self = this; // As a best practice, in each method we will asign "this" to the variable "self" so that it remains scope-agnostic. We will use it to refer to the parent "buttonFilter" object so that we can share methods and properties between all parts of the object.
            self.$filters = $('#Filters');
            self.$container = $('#main');
            self.$filters.find('.button-group').each(function() {
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
        bindHandlers: function() {
            var self = this;
            // Handle filter clicks
            self.$filters.on('click', '.filter', function(e) {
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
        parseFilters: function() {
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
        concatenate: function() {
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
    var mapPublisherToScore = function() {
        var publishers = _(feed.sites),
            scores = _(publishers).map('score').map(function(score) {
                return toLetterGrade(parseInt(score));
            }).value();
        return _.zipObject(_.map(publishers, 'name'), scores);
    };

    /**
     * Convert a score out of 100 to a letter grade
     * @param int score to be converted
     * @return String letter grade
     */
    var toLetterGrade = function(score) {
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
     * Set the sites that were retrieved from the server
     * @param JSON data retrieved containing sources from which to fetch articles from
     */
    var setSites = function(data) {
        var promise = $.Deferred();
        sourceList = data;
        var user_sites = _.map(feed.sites, 'id');
        activeSources = _.filter(sourceList, function(source) {
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
    var setupTemplates = function() {
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
    var setupEvents = function() {
        $(document.body).on('click', '.save-article', saveArticle);
        $(document.body).on('hover', '#toggle-filter', $('#toggle-filter').click);
        $(document.body).on('click', '.view-mode', toggleViewMode);
        $('#enable-all').on('mousedown', $('#main .disabled.grid-item .toggle').click);
        $('#disable-all').on('mousedown', $('#main .grid-item:not(.disabled) .toggle').click);
        $(document.body).on('click', '.post', function() {});
        $(document.body).on('click', '#hide-info-bar', toggleInfoBar);
        $(document.body).on('click', '.visibility.toggle', toggleVisibility);
        $(document.body).on('click', '.tab-content:not(.saved) .social-btn', shareArticle);
        $(document.body).on('change', config.elements.selectedPartner, updateSearchSort);
        $(document.body).on('change', config.elements.sortDropdown, updateSortBy);
        $(document.body).on('click', 'li#savelinks a', saveSelectedLinks);
        $(document.body).on('keypress blur', '#search', updateSearchTerms);

        $(document.body).on('click', '.share.tag', function(evt) {
            _.defer(function() {
                $(this).closest('.grid-item').removeClass('selected');
            }, this);
        });

        $(document.body).on('click', '.url', function(evt) {
            return evt.stopPropagation();
        });

        $(document.body).on('click', '.grid-item', selectArticle);

        $(document.body).on("click", "li#clearsave a", function() {
            clearSaved();
            document.getElementById('share-ucid').value = '';
        });

        bindUTMTagEvents();
        bindEditArticleForm();
        bindRelatedToEvents();
    };

    /**
     * Update search terms
     * @params jQuery.Event e
     */
    var updateSearchTerms = function(e) {
        //detect enter key
        if ((event.type == "keypress" && e.which == 13) || event.type == "blur") {
            var text = $("#search").val().length > 2 ? $("#search").val() : null;
            if (searchTerm !== text) {
                text ? feed.search.text = text : delete feed.search.text;
                //if no text we want to sort by date again
                !text ? feed.search.sort = "creation_date desc" : null;

                //Collecting the info for GTM
                var dataLayer = [{
                    'event': "GAevent",
                    'text': feed.search.text,
                    'sort': feed.search.sort,
                    'partner_id': feed.search.influencer_ids,
                    'site_ids': feed.search.site_ids
                }];

                searchContent(feed.search);

                searchTerm = text;
            }
        }
    };

    /**
     * Selects an article
     * @param jQuery.Event e
     */
    var selectArticle = function(e) {
        // TODO: use this for generating permalinks
        if (e.target.type !== 'button') {
            $(this).toggleClass('selected');
            var isAnyArticleSelected = document.querySelectorAll('.grid-item.selected').length > 0;
            document.body.classList.toggle('select-mode', isAnyArticleSelected);
        }
    };

    /**
     * Update sort by
     */
    var updateSortBy = function(argument) {
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
    var saveSelectedLinks = function(e) {
        e.preventDefault();
        if (!document.body.classList.contains('show-infobar')) {
            toggleInfoBar();
        }
        save_links();
        $('.grid-item').each(deselect);
    };

    /**
     * Update the search sort
     */
    var updateSearchSort = function(argument) {
        var id = $(this).val();
        localStorage.setItem(config.storageKeys.partner, id);
        feed.selected_partner = id;
        feed.search.influencer_ids = id;

        // Otherwise, just update the highlighting of any saved posts
        showSavedArticles();
        // and deselect any selected posts
        clearSaved();

    };

    /**
     * Select the social platform
     * @param jQuery.Event e
     */
    var selectSocialPlatform = function(e) {
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

    var saveArticle = function(e) {
        var $article = $(this).closest('.grid-item.article');
        var ucid = $article.data('id');

        var savedList = altHack.list.store.getSavedList();
        var savedArticles = savedList.articles;
        var isSaved = _.find(savedArticles, function(el) {
            return el.ucid == ucid;
        });

        if (!savedList.isLoading && isSaved == undefined) {
            //The article is not saved, save it
            window.dispatchEvent(new CustomEvent('savedArticle', { detail: { ucid: ucid, articleElement: $(this).closest('.grid-item')[0] } }));
            $article.removeClass('not-saved');
            $article.addClass('saved');
            $article.find('.save-article').addClass('mdl-button--accent');
        } else if (!savedList.isLoading) {
            //The article is already saved, remove it
            window.dispatchEvent(new CustomEvent('removeSavedArticle', { detail: { ucid: ucid, articleElement: $(this).closest('.grid-item')[0] } }));
            $article.removeClass('saved');
            $article.find('.save-article').removeClass('mdl-button--accent');
            $article.addClass('not-saved');
        }

        return e.stopPropagation();
    };

    /**
     * Generate a custom URL for the selected article and social media platform
     * @param jQuery.Event e
     */
    var shareArticle = function(e) {
        $(this).closest('.grid-item').removeClass('selected');
        e.preventDefault();
        var btn = this;
        var user_email = user.email;
        var partner_id = feed.selected_partner;
        var article = _.find(feed.articles.data, { id: btn.dataset.ucid });
        var platform_id = feed.platforms.names.indexOf(btn.dataset.platform);
        platform_id = platform_id > 0 ? platform_id : feed.platforms.names.indexOf('Facebook');

        if ('fields' in article && user_email && partner_id && platform_id) {
            article = article.fields;
            var payload = {
                article_utm: 'article_utm' in article ? article.article_utm.join() : '',
                client_id: article.client_id.join(),
                date: article.creation_date.join(),
                image: article.image.join(),
                link_type: article.link_type.join(),
                site_id: article.site_id.join(),
                title: article.title.join(),
                ucid: article.ucid.join(),
                url: article.url.join(),
                partner_id: partner_id,
                platform_id: platform_id,
                user_email: user_email,
                source: 'contempo'
            };

            API.request(API_BASE_URL + '/links', payload, 'post').then(function(msg) {
                log(msg);
                if (msg.status_txt !== 'ERROR') {
                    var linkData = this.dataset;
                    linkData.url = msg.shortlink;

                    window.dispatchEvent(new CustomEvent('sharedArticle', { detail: { platform: linkData.platform, article: payload, linkPayload: Object.assign({}, linkData) } })); // We're going to notify our React dispatcher about something that happened in legacy via window.CustomEvent

                    // Only direct links open a new tab
                    if (linkData.platformUrl === 'undefined') {
                        return;
                    }

                    var href = linkData.platformUrl.replace(/({\w+})/g, function(args) {
                        return encodeURIComponent(linkData[args.replace(/{|}/g, '')]);
                    });

                    var shareBtn = document.createElement('a');
                    shareBtn.setAttribute('href', href);
                    shareBtn.setAttribute('target', '_blank');
                    shareBtn.click();
                } else {
                    console.error(msg);
                }
            }.bind(btn));
        }

        document.querySelector('.btn-group.open').classList.remove('open');
        return e.stopPropagation();
    };

    /**
     * Bind any events related to UTM Tags here
     */
    var bindUTMTagEvents = function() {
        $(document.body).on('click', config.elements.articleUtmTag, function(evt) {
            evt.stopPropagation();
        });

        $(document.body).on('click', config.elements.articleUtmButton, function(evt) {
            var $gridItem = $(this).closest('.grid-item');
            $gridItem.addClass('editing');
            evt.stopPropagation();
        });

        $('body').on('keyup', config.elements.articleUtmTag, function(evt) {
            if (evt.keyCode === 13) {
                $(this).closest(config.elements.articleTile).find(config.elements.articleUtmButton).click();
            }
        });
    };

    /*
     * Bind events related to finding related articles
     */
    var bindRelatedToEvents = function() {
        $(document.body).on('click', config.elements.articleRelated, function(evt) {
            evt.stopPropagation();
        });

        $(document.body).on('click', config.elements.articleRelated, function(evt) {
            var ucid = $(this).closest('.grid-item').data().id;
            window.open(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/#/related/' + ucid);
        });
    };

    /**
     * Bind events to the edit article form
     */
    var bindEditArticleForm = function() {
        // toggle showing of this form
        $(document.body).on('click', config.elements.editArticleForm, function(e) {
            e.stopPropagation();
        });

        // async update article
        $(document.body).on('change', config.elements.editArticleForm + ' input', function(e) {
            var element = e.originalEvent.target;

            switch (element.name) {
                case 'utm':
                    saveUTM(element);
                    break;
            }
        });

        // switch back to article view
        $(document.body).on('click', config.elements.updateArticleButton, function(e) {
            $(this).closest('.grid-item').removeClass('editing');
            e.stopPropagation();
        });
    };

    /**
     * Save the UTM tag
     * @param Element element containing the UTM tags to save
     */
    var saveUTM = function(element) {
        if (isValidURIParams(element)) {
            var utm = element.value;
            API.saveUTM(element.dataset.ucid, {
                utm: utm
            }).then(function() {
                var articleToUpdate = _.find(feed.articles.data, { id: element.dataset.ucid });
                if ('fields' in articleToUpdate) {
                    articleToUpdate.fields.article_utm = [utm];
                }
            });
        } else {
            var $panel = $(element).closest('.grid-item');
            $panel.addClass('has-utm-error');
            var tmp = element.value;
            $(element).val('Invalid UTM entered');
            setTimeout(function() {
                $(element).val(tmp);
                $panel.removeClass('has-utm-error');
            }.bind(this), 1500);
        }
    };

    /**
     * Check if uri params is valid
     * @param Element element the input text field
     */
    var isValidURIParams = function(element) {
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
        enabled: _.debounce(function() {
            markAs('enabled');
        }, requestWaitTime),
        disabled: _.debounce(function() {
            markAs('disabled');
        }, requestWaitTime)
    };

    /**
     * Based on the action, call the corresponding endpoint and modify the appropriate queue
     * @param String action to perform is either enable/disable
     */
    var markAs = function(action) {
        var ids = toggleArticleRequestQueues[action];
        if (ids.length < 1) return false; // skip because we didn't make changes

        var url = API_BASE_URL + '/articles/mark-' + action + '?ids=' + ids.join(','),
            req = {
                token: apiKey
            };

        // Make the request to toggle articles
        API.request(url, req, 'post').then(function(response) {
            if (response[0]._settledValue.adds < ids.length) {
                revertArticleState(ids, action);
            }
        }.bind(this)).fail(function(error) {
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
    var revertArticleState = function(articleIds, action) {
        articleIds.map(function(id) {
            $('#selectable .article[data-id="' + id + '"] .grid-item').toggleClass('disabled'); // assume that it was already toggled before, we just toggle it back
            return _.find(feed.articles.data, {
                id: id
            });
        }).forEach(function(article) {
            setRowData(article, action === 'enabled' ? ['0'] : ['1']); // set the opposite
        });
    };

    /**
     * Toggle view modes from grid to tables
     */
    var toggleViewMode = function() {
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
    var toggleDisabledArticle = function(articleElement) {
        var articleId = articleElement.dataset.id,
            disableArticle = $(articleElement).toggleClass('disabled').hasClass('disabled'), // fade out article
            article = _.find(feed.articles.data, {
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
     * Sum up the values of the list elements specified by the property and output each list item
     * @param Array list to iterate through
     * @param String property that stores the Number that will be summed up
     * @param jQueryElement output is where all the list elements will be appended to. Note that previous elements will be cleared
     */
    var showCountersFor = function(list, property, output) {
        var listItems = _.countBy(list, property);
        $(output).empty().append(buildCounterListItems(listItems, property));
    };

    /**
     * Return a string representation of HTML List Elements
     * @param Object obj an object where key is label and value is the counter
     * @param String property distinguishes one group of filters from another (ie. sites and platforms)
     * @return String list element should be appended to a list element
     */
    var buildCounterListItems = function(obj, property) {
        return _.chain(obj).keys()
            .map(function(key) {
                return {
                    label: key,
                    count: obj[key]
                };
            })
            .sortBy(function(obj) {
                return obj.count;
            })
            .reverse()
            .reduce(function(memo, obj) {
                var lowercased = obj.label.toLowerCase(),
                    tag = 'check-' + lowercased;

                var data = {
                    id: 'filter-' + lowercased,
                    label: obj.label,
                    count: obj.count,
                    name: property
                };

                return memo + templates.mtdLinkFilterCheckbox(data);
            }, '').value();
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

    function showCtr(articleElement, perfObjs) {
        var current_partner = feed.selected_partner;
        if (feed.testing_selected_partner > 0)
            current_partner = feed.testing_selected_partner;
        var div = articleElement.find('.ctr_60_min')[0];
        var avg = articleElement.find('.ctr_60_min_mean')[0];
        var height, avgHeight;
        if (!div) {
            return;
        }
        if (perfObjs && perfObjs.length > 0) {
            var sum = 0,
                num = 0;
            for (var i = 0; i < perfObjs.length; i++) {
                var perfObj = perfObjs[i];
                var ctr = perfObj.ctr_60_min;
                if (ctr >= 0) {
                    sum += ctr;
                    num++;
                    if (current_partner == perfObj.influencerId) {
                        height = ctr;
                    }
                }
            }
            if (num > 0) {
                var avgCtr = sum / num;
                avgHeight = avgCtr;
            }
            if (height >= 0) {
                div.style.width = '' + height + 'px';
            }
            if (avgHeight >= 0) {
                avg.style.width = '' + avgHeight + 'px';
            }

            if (height > avgHeight) {
                div.style.backgroundColor = '#F50057';
            }

            articleElement.find('.ctr-group').css({ backgroundColor: '#eee' });
        }
    }

    function getPerformanceData(articles) {
        var articlesByUcid = {};
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            if (article.fields.ucid && article.fields.ucid.length > 0)
                articlesByUcid[article.fields.ucid[0]] = article
        }
        var ucids = Object.keys(articlesByUcid);

        if (ucids.length == 0) {
            return [];
        } else {

            return API.request(API_BASE_URL + '/articles/performance', {
                ucids: ucids.toString()
            }).then(function(response) {
                // feed.testing_selected_partner = findPopularInfluencer(response.data);
                if (response.data && response.status_txt == 'OK') {
                    for (i = 0; i < response.data.length; i++) {
                        var perfObj = response.data[i];
                        articlesByUcid[perfObj.ucid].performance = perfObj.performance;
                        var articleElement = articleElements[perfObj.ucid];
                        showCtr(articleElement, perfObj.performance);
                    }
                    return articles;
                }
                return [];
            });
        }
    }

    function findPopularInfluencer(perfs) {
        var influencers = {};

        for (var i = 0; i < perfs.length; i++) {
            var perf = perfs[i];
            var performanceArray = perf.performance;
            for (var j = 0; j < performanceArray.length; j++) {
                var performance = performanceArray[j];
                var influencerId = performance.influencerId;
                if (influencers[influencerId] > 0)
                    influencers[influencerId]++;
                else
                    influencers[influencerId] = 1;
            }
        }
        var max = {
            influencerId: 0,
            number: 0
        };

        for (influencerId in influencers) {
            if (influencers[influencerId] > max.number) {
                max.influencerId = influencerId;
                max.number = influencers[influencerId];
            }
        }
        return max.influencerId;
    }

    /**
     * Update the list of articles
     * @param Array articles that will replace what's stored on feed.articles.data
     * @return Array new feed.articles.data
     */
    function updateArticles(newValue) {
        sanitize(newValue);
        window.dispatchEvent(new CustomEvent('getSavedArticles', { detail: { ucidsToMatch: _.map(newValue, 'id'), next: markSavedArticles } }));
        getPerformanceData(newValue)
        feed.articles.data = newValue;
        feed.articles.list = _(feed.articles.data).map('fields').map(getArticleKeys).value();

        if (typeof articlesTableAPI === 'undefined') {
            initializeArticlesTable();
        } else {
            mapUcidToRowIndex = {};
            articlesTableAPI.clear().rows.add(feed.articles.list).draw();
        }
    }

    /**
     * Mark saved articles as saved
     * @param Array saved articles
     */
    function markSavedArticles(saved) {
        console.log('I am marking the following as saved', saved);
    }

    /**
     * Initialize the articles data table
     */
    function initializeArticlesTable() {
        var columnDefs = [{
            title: 'Created At',
            className: 'td-created-at align-center',
            width: '8rem',
            render: function(data, type, full, meta) {
                return type === 'display' ? moment.utc(data, 'YYYY-MM-DD[T]HH:mm:ss[Z]').local().format("MM/DD/YYYY") : data;
            }
        }, {
            title: 'Title',
            className: 'td-title',
            render: function(data, type) {
                return type === 'display' ? '<span>' + data + '</span>' : data;
            }
        }, {
            title: 'URL',
            width: '20rem',
            className: 'td-url',
            render: function(data, type, full, meta) {
                var url = data.replace('http://', ''),
                    display = '<a href="[data]" target="_blank" class="tooltips">[url]</a>';

                return type === 'display' ? display.replace('[data]', data).replace('[url]', url) : data;
            }
        }];

        if (/admin|publisher/.test(user.role)) {
            columnDefs.push({
                title: 'Disabled?',
                className: 'align-center',
                width: '2.5rem',
                render: function(data, type, full, meta) {
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
            fixedHeader: true,
            dom: '<"toolbar row"<"col-sm-6"l><"col-sm-6"f>>rt<"toolbar row"<"col-sm-6"i><"col-sm-6"p>>',
            pageLength: localStorage.getItem(config.storageKeys.pageLengthExplore) || 50,
            data: feed.articles.list,
            columns: columnDefs
        });

        articlesTableAPI.on('length', function(evt, settings, newValue) {
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
     * Returns an object where the key maps to an object attribute and value is an array of accepted values
     * Use this for data table
     * @param jQueryElements filterGroups is an array of container elements wherein each represents a column to filter through
     * @return Object where key maps to a column name and value is the set of accepted values for that filtered column
     */
    var getColumnFiltersFor = function(filterGroups) {
        var filterGroups = _.groupBy(filterGroups, function(el) {
            return el.dataset.attribute;
        });

        for (var group in filterGroups) {
            filterGroups[group] = _.map($(filterGroups[group]).find('input:checked'), function(el) {
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
    var applyColumnFiltersToRows = function(filters, rows) {
        return _.filter(rows, function(row) {
            for (var filter in filters) {
                if (!_(filters[filter]).includes(row[filter])) {
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
    var onCheckAllFilters = function() {
        $(this).closest(config.elements.statsFilterGroup).find('input:not(:checked)').click();
    };

    /**
     * Uncheck all filters within the same group
     * @param Element this is the link that was clicked
     */
    var onCheckNoFilters = function() {
        $(this).closest(config.elements.statsFilterGroup).find(':checked').click();
    };

    /**
     * Check if the device is mobile
     * @return bool if device is mobile
     */
    var isMobile = function() {
        return !!navigator && 'userAgent' in navigator && /android|blackberry|iphone|ipad|ipod|opera mini|iemobile/i.test(navigator.userAgent);
    };

    /**
     * Get a query string parameter by name.
     */
    var getParameterByName = function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    var removeArticleFilterParams = function() {
        var relatedRegex = /([?&]relatedto=[0-9]*)/;
        var ucidsRegex = /([?&]ucid=[0-9,]*)/;

        var newLocation = window.location.href.replace(relatedRegex, '');
        newLocation = newLocation.replace(ucidsRegex, '');

        window.location.href = newLocation;
    }

    var loadContent = function(searchFilters) {
        feed.view = 'explore';
        searchContent(searchFilters);
    };

    // Only make these methods available
    return {
        initialize: initialize,
        toggleDisabledArticle: toggleDisabledArticle,
        getInfo: get_info,
        loadContent: loadContent,
        searchMoreContent: searchMoreContent,
        initDatePicker: initDatePicker,
        updateSavedState: showSavedArticles
    };
})();

$(function() {
    exploreApp.initialize();
});
