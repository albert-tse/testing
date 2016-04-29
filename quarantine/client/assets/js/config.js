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

var dashboard = {
    view: "mylinks",
    articles: {},
    links: {},
    scoreMap: {},
    search: {
        order: 'desc',
        sort: '_rand_' + parseInt(Math.random() * 10000) + ' desc'
    }};

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
        viewMode: '.view-mode[data-mode=value]',
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
    },
    shareURLs: {
        'Facebook': 'https://www.facebook.com/sharer/sharer.php?u={url}',
        'Twitter': 'https://twitter.com/intent/tweet?url={url}',
        'Tumblr': 'http://www.tumblr.com/share/link?url={url}&name={title}&description={description}',
        'Pinterest': 'http://www.pinterest.com/pin/create/button/?url={url}&media={image}&description={description}',
        'Google +': 'https://plus.google.com/share?url={url}'
    }
};

feed.sharePermalink = function () {
    var selectedArticles = document.querySelectorAll('.grid-item.selected');

    if (selectedArticles.length > 0) {
        var ucids = [].map.call(selectedArticles, function (article) {
            return article.dataset.id;
        }).join(',');
        var permalink = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/?ucid=' + ucids;

        // Copy permalink to clipboard
        var input = document.createElement('input');
        document.body.appendChild(input);
        input.value = permalink;
        input.focus();
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);

        // Tell user that url is copied to clipboard
        var link = document.createElement('a');
        document.body.appendChild(link, document.body.firstChild);
        link.href = permalink;
        link.target = '_blank';
        link.className = 'hidden';
        link.click();
        document.body.removeChild(link);
        window.scrollTo(0,0);

        feed.cancelSelection();
    }
};

feed.selectAll = function () {
    var unselectedArticles = document.querySelectorAll('.grid-item:not(.selected)');
    [].forEach.call(unselectedArticles, function (article) {
        article.classList.add('selected');
    });
};

feed.enableAll = function (shouldEnable) {
    var selectedArticles = document.querySelectorAll('.grid-item.selected' + (shouldEnable ? '.disabled' : ':not(.disabled)')); // if enabling articles, select disabled articles, and vice versa
    [].forEach.call(selectedArticles, exploreApp.toggleDisabledArticle);
    feed.cancelSelection();
};

feed.cancelSelection = function () {
    var selectedArticles = document.querySelectorAll('.grid-item.selected');
    [].forEach.call(selectedArticles, function (article) {
        article.classList.remove('selected');
    });
    document.body.classList.remove('select-mode');
};
