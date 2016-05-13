var dashboardApp = (function () {
    'use strict';

    var articleElements = {};

    $.fn.foundation = function () {
        return;
    };

    var initialize = function () {
        // Prepare DOM Components
        setupTemplates();
        setupEvents();
        initStatsDateRangePicker();
        checkAuth();

        document.body.classList.toggle('is-mobile', isMobile());
    };

    var checkAuth = function () {
        var authState = altHack.auth.store.getState();
        if (authState.isAuthenticated && authState.token) {
            $(document.body).addClass('signed-in');
            apiKey = authState.token;
            dashboard.search.user_email = "jtymann@gmail.com";
            user.email = dashboard.search.user_email;

            initFeed().then(setSites)
                .then(filterContent);
        }
    }

    var filterContent = function () {
        var promise = $.Deferred();

        loadInitial();
        promise.resolve();
        

        return promise;
    };

    /**
     * Initialize the dashboard before loading any articles
     */
    var initFeed = function () {
        var promise = $.Deferred();

        buttonFilter.init();
        generateClientFilter();
        $.fn.dataTable.moment("MMM Do, YYYY [at] h:mm A");

        // TODO Because of security purpose this should be done on the server side..
        if (user.role == "internal_influencer" || user.role == "external_influencer") {
            dashboard.search.enabled = 1;
            dashboard.search.link_types = 2; //The next line should be commented when we have the icon
        }

        return $.when(
            API.request(API_BASE_URL + '/users/me'), // get user info
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
   
    var loadDashboard = function () {
        dashboard.view = 'mylinks';
        $('#container').css("padding-right", "0");
        // The search bar from Explore isn't meant to be used with My Links
        $("#search").val("");
        delete dashboard.search.text;

        if (user.role === 'publisher' && !!user.publisher_ids && user.publisher_ids.length > 0) {
            $('#source-row').hide();
            refreshMTDTable();
        } else {
            dashboard.search.influencer_ids = $('#partner').val();
            dashboard.selected_partner = getSelectedPartner();
            refreshMTDTable();
        }
    }

    var refreshMTDTable = function () {
        dashboard.selected_partner = $(config.elements.selectedPartner).val();
        dashboard.mtdLinks = [];
        if (user.role === 'publisher') {
            _.each(user.publisher_ids, function (publisher) {
                getMTDTotalLinksShared('publishers', publisher).then(displayMTDTable).fail(console.log);
            });
        } else {
            if (dashboard.selected_partner) {
                getMTDTotalLinksShared('influencers', dashboard.selected_partner)
                    .then(getDailyClicksFactory(dashboard.selected_partner))
                    .then(displayMTDTable)
                    .fail(console.log);
            }
        }
    };

    /**
     * Get the currently selected partner from web storage
     * @return string the current selected partner
     */
    var getSelectedPartner = function () {
        var selected = localStorage.getItem(config.storageKeys.partner);
        if (!_.chain(dashboard.partners).map('id').includes(selected).value()) {
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
                dashboard.search.timestamp_start = range.start;
                dashboard.search.timestamp_end = range.end;
                refreshMTDTable();
            }
        });

        $statsPicker.daterangepicker('setRange', {
            start: moment().startOf('month').toDate(),
            end: moment().endOf('day').toDate()
        });
    };


    // Load initial content
    var loadInitial = function () {
        
        publisherIds = _.map(activeSources, 'id');
        dashboard.search.site_ids = [].join.call(getSelectedSitesFromStorage(), ',');
        dashboard.site_ids = publisherIds.toString();

        updateSearchDateRange();

        dashboard.selected_partner = getSelectedPartner();

        loadDashboard();

        $(".network").css("display", "flex").hide();

    };

    var updateSearchDateRange = function () {
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
                    _oldSelected = dashboard.search.site_ids;

                selected.length > 0 ? dashboard.search.site_ids = id : dashboard.search.site_ids = dashboard.site_ids;
                localStorage.setItem(config.storageKeys.sites, JSON.stringify(selected));

                // Search for either content or links data depending on which tab we're currently in
                if (_oldSelected !== dashboard.search.site_ids) {
                    switch (dashboard.view) {
                        case 'explore':
                            searchContent(dashboard.search);
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
        dashboard.sites = sites;
    };

    /**
     * Update the partners list
     * Use this method whenever the partners data has to be changed
     * Add any functions that should be called upon changing dashboard.partners here
     * @param Array partners new value
     */
    var updatePartners = function (influencers) {
        dashboard.partners = influencers;
        generatePartners(); // Reset dropdown menu
    };

    /**
     * Update the platforms list
     * This will be used to map platform ids to names
     * @param Object platforms
     */
    var updatePlatforms = function (platforms) {
        dashboard.platforms = platforms;
        dashboard.platforms.names = [];
        for (var i = 0; i < dashboard.platforms.data.length; i++) {
            dashboard.platforms.names[dashboard.platforms.data[i].id] = dashboard.platforms.data[i].name;
        }
    };

    /**
     * Populate Partner pulldown for user
     */
    var generatePartners = function () {
        var dropdownMenu = document.getElementById('partner'),
            menuHTML = '';

        var ids = _.chain(dashboard.partners).sortBy(function (partner) {
            return partner.name.toLowerCase();
        }).map(function (partner) {
            menuHTML += templates.partnerOption({
                id: partner.id,
                name: partner.name
            });
            return partner.id;
        }).value();

        dashboard.search.influencer_ids = ids.join();
        dashboard.selected_partner = getSelectedPartner();
        dropdownMenu.innerHTML = menuHTML;
        $(config.elements.selectedPartner).val(dashboard.selected_partner || $(config.elements.firstPartner).val());
    };

   

    /**
     * Initializes the datatable for the My Links view
    var refreshLinks = function (links, callback) {
        linksDatatable = $(config.elements.mtdLinkTable).DataTable({
            autoWidth: false,
            destroy: true,
            deferRender: false,
            data: links,
            pageLength: localStorage.getItem(config.storageKeys.pageLengthMyStats) || 50,
            dom: '<"toolbar row"<"col-sm-6"l><"col-sm-6"f>>rt<"toolbar row"<"col-sm-6"i><"col-sm-6"p>>',
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
     */

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
        var partner = _.findWhere(dashboard.partners, {
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
     * Set the sites that were retrieved from the server
     * @param JSON data retrieved containing sources from which to fetch articles from
     */
    var setSites = function (data) {
        var promise = $.Deferred();
        sourceList = data;
        var user_sites = _.map(dashboard.sites, 'id');
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
        
        // $(config.elements.toggleSidebar).on('click', onToggleSidebar);
        $(config.elements.checkAllFilters).click(onCheckAllFilters);
        $(config.elements.checkNoFilters).click(onCheckNoFilters);
        $(document.body).on('change', config.elements.selectedPartner, refreshMTDTable);

        $(document.body).on('click', config.elements.mtdLinkFilter, onMtdLinkFilter);
        $(document.body).on('click', '.post', function () {});
        
        $(document.body).on('click', '.url', function (evt) {
            return evt.stopPropagation();
        });
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
     * Get the Month-to-Date totals for shared links
     * @param String role is either influencer or publisher
     * @param int id of user to fetch
     * @return jQuery Promise
     */
    var getMTDTotalLinksShared = function (role, id) {
        var reqData = {
            token: apiKey,
            timestamp_start: dashboard.search.timestamp_start || moment().startOf('month').startOf('day').format(),
            timestamp_end: dashboard.search.timestamp_end || moment().endOf('month').endOf('Day').format(),
            include_fb: false
        };

        //timestamp_start: moment().subtract(1, 'years').startOf('month').format('YYYY-MM-DD HH:mm:ss')
        //timestamp_start: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')
        reqData[role.replace(/s$/, '_id')] = id;
        $(config.elements.loadingIcon).removeClass('hide');
        return API.getMTDTotalLinksShared(role, reqData);
    };

    var hideDailyChart = function() {
        var svg = d3.select('#dailyChart');
        svg.style('display', 'none');
    };

    var drawDailyClicksBarChart = function(clicks) {
        var format = d3.time.format('%b %d');
        clicks.forEach(function(d) { 
            d.date = format(new Date(d.date));
        });
        var margin = {top: 20, right: 100, bottom: 50, left: 100};
        var parentWidth = $('#dailyChart').parent().width();
        var width = parentWidth - margin.left - margin.right;
        if (width / clicks.length > 50)
            width = 50 * clicks.length;
        var height = 300 - margin.top - margin.bottom;
        var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
        var y = d3.scale.linear().range([height, 0]);
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);
        d3.selectAll("#dailyChart > *").remove();
        var svg = d3.select("#dailyChart")
            .style("display", "block")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        x.domain(clicks.map(function(d) {return d.date; }));
        y.domain([0, d3.max(clicks, function(d) { return d.clicks; })]);
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '-.55em')
            .attr('transform', 'rotate(-60)');
        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);
        svg.selectAll('bar')
            .data(clicks)
            .enter().append('rect')
            .style('fill', 'blue')
            .attr('x', function(d) { return x(d.date); })
            .attr('width', 20)
            .attr('y', function(d) { return y(d.clicks); })
            .attr('height', function(d) { return height - y(d.clicks); })
            .on("mouseover", function (d) {
                var xposition = window.innerWidth <= 1024 ? d3.event.clientX + 15 : d3.event.clientX - 230;
                d3.select("#tooltip")
                    .style("left", xposition + "px")
                    .style("top", d3.event.clientY - 50 + "px")
                    .style("opacity", 1)
                    .select("#value")
                    .text(addCommas(d.clicks));
            })
            .on("mouseout", function () {
                // Hide the tooltip
                d3.select("#tooltip")
                    .style("opacity", 0);;
            });        
    };

    var getDailyClicksFactory = function( id) {
        return function(res) {
            return getDailyClicks(id).then(function(datedClicks) {
                if(datedClicks && datedClicks.length > 0)
                    drawDailyClicksBarChart(datedClicks);
                else
                    hideDailyChart();
                return res;
            });
        };
    };

    /**
     * Get the daily clicks for give influence for given date range
     * @param String role is either influencer or publisher
     * @param int id of user to fetch
     * @return jQuery Promise
     */
    var getDailyClicks = function (id) {
        var reqData = {
            token: apiKey,
            timestamp_start: dashboard.search.timestamp_start || moment().startOf('month').startOf('day').format(),
            timestamp_end: dashboard.search.timestamp_end || moment().endOf('month').endOf('Day').format(),
            influencer_id: id
        };
        $(config.elements.loadingIcon).removeClass('hide');
        return API.getDailyClicks(reqData);
    };

            
    /**
     * Process the shared links MTD 
     * @param Object res is the JSON data the server responded with
     */
    var displayMTDTable = function (res) {

        // We're going to format the output slightly differently for publishers and other users
        if (user.role !== 'publisher') {
            dashboard.mtdLinks = dashboard.mtdLinks.concat(buildLinksInfluencer(res));
        } else {
            dashboard.mtdLinks = dashboard.mtdLinks.concat(buildLinksPublisher(res));
        }

        displayAggregatedStats(dashboard.mtdLinks, aggregateStats(dashboard.mtdLinks));

        // display sidebar counters
        showCountersFor(dashboard.mtdLinks, 'site_name', config.elements.sitesList);
        showCountersFor(dashboard.mtdLinks, 'platform', config.elements.platformsList);

        // Display data table
        $(config.elements.mtdLinkTable).DataTable({
            dom: '<"toolbar row"<"col-sm-4"l><"col-sm-8"<"row"<"col-sm-8"T><"col-sm-4"f>>>>rt<"toolbar row"<"col-sm-6"i><"col-sm-6"p>>',
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
            data: dashboard.mtdLinks,
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
                    width: '10rem',
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
                    title: 'Reach',
                    data: 'fb_reach',
                    render: function (data, type) {
                        if (type !== 'sort' && data) {
                            return addCommas(data);
                        } else {
                            return data;
                        }
                    }
                }, {
                    title: 'CTR',
                    data: 'ctr',
                    render: function (data, type) {
                        if (type !== 'sort' && data) {
                            return parseFloat(data).toFixed(2) + '%';
                        } else {
                            return data;
                        }
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
                    platform: dashboard.platforms.names[link.platform_id],
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
            link = _.chain(link).pick('link', 'hash', 'total_clicks', 'saved_date', 'title',  'site_name', 'cost', 'cpc', 'fb_reach', 'ctr').extend({
                platform: dashboard.platforms.names[link.platform_id],
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
        stats.totalPosts = links.length;
        stats.avgCPP = stats.totalClicks / links.length || 0;
        stats.avgCPP = stats.avgCPP.toFixed(2);
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
        $(config.elements.avgCPP).text(addCommas(stats.avgCPP));
        $(config.elements.totalPosts).text(addCommas(stats.totalPosts));
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
                    count: obj[key]
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


    /**
     * Converts a number (float) to a fixed precision with commas every thousandth place
     * @param Number number to convert
     * @param Number precision how many places to the right of the decimal point to show
     * @return Number that has commas and fixed to 2 numbers after the decimal
     */
    function toCurrency(number, precision) {
        if (number) {
            return '$' + number.toFixed(precision || 2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        } else {
            return '$0.00';
        }
    }

    /**
     * Add commas to large numbers
     * @param Number/String num to add commas to
     * @return String num with commas added
     */
    function addCommas(num) {
        if (num) {
            return num.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
        } else {
            return 0;
        }
    }

    
    /**
     * Filter the rows on the MTD links datatable based on the filters (ie. sites and platforms)
     */
    var onMtdLinkFilter = function () {
        var filters = getColumnFiltersFor($(config.elements.statsFilterGroup)),
            links = applyColumnFiltersToRows(filters, dashboard.mtdLinks);

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

    // Only make these methods available
    return {
        initialize: initialize,
        refreshMTDTable: refreshMTDTable
    };
})();

$(function () {
    dashboardApp.initialize();
});
