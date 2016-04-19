var sites, platforms, partners, linksDatatable, apiKey;

// default values
var user = {};
var statsTable = $("#feedStats").html();
var searchTerm = {};
var sourceList = [];
var activeSources = [];
var publisherIds = [];
var j;
var templates = {}; // templates

// intialize our site object
var feed = {
    view: "explore",
    articles: {},
    links: {},
    scoreMap: {},
    search: {
        order: 'desc',
        sort: '_rand_' + parseInt(Math.random() * 10000) + ' desc'
    }
};

var config = {
    elements: {
        aggregatedCostOrRevenue: '#aggregated-cost-or-revenue',
        articleUtmButton: '.edit-utm',
        articleUtmField: '.utm-tags input',
        articleUtmTag: '.utm-tags',
        articleTile: '.grid-item',
        articleRelated: '.related',
        avgCPC: '#avgCPC',
        checkAllFilters: '.stats-filter-group .check-all',
        checkNoFilters: '.stats-filter-group .check-none',
        clearSelection: '#clearsave a',
        estimatedCost: '#estimatedCost',
        editArticleForm: '.edit-article',
        firstPartner: '#partner option:first',
        grid: '#selectable',
        infoBar: '#info-bar',
        loadingIcon: '#loading',
        mtdLinkFilter: '.stats-filter-group input[type="checkbox"]',
        mtdLinkTable: '#linkTable',
        platformsList: '#platforms-list',
        selectedPartner: '#partner',
        sitesList: '#sites-list',
        sortDropdown: '#sort-by',
        sourceOptions: '#source option',
        sourcesDropdown: '#source',
        statsDateRangePicker: '#reportrange-stats',
        statsFilterGroup: '.stats-filter-group',
        toggleSidebar: '#toggle-sidebar',
        totalClicks: '#totalClicks',
        updateArticleButton: '.update-article',
        viewMode: '.view-mode [data-mode=value]',
    },
    storageKeys: {
        mode: 'defaultViewMode',
        pageLengthExplore: 'defaultPageLengthExplore',
        pageLengthMyStats: 'defaultPageLengthMyStats',
        partner: 'defaultPartner',
        sites: 'defaultSites',
        sort: 'defaultSorting',
    },
    options: {
        datepicker: {
            numberOfMonths: 2
        }
    }
};
