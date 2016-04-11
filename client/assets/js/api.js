/**
 * API Requests
 * Consolidate all requests to the backend here
 */
var API = API || {};

API.saveLink = function (data) {
    return API.request('/site/save_link/', data, 'post');
};

API.refreshClicks = function (data) {
    return $.ajax({
        url: 'https://po.st/api/daily',
        data: data,
        dataType: 'jsonp',
        type: 'post',
        error: function (data, xhr) {
            console.error('Could not complete request: ', data, xhr);
        }
    });
};

API.getMTDTotalLinksShared = function (role, data) {
    return API.request(API_BASE_URL + '/' + role + '/get_mtd_total_links_shared', data);
};

API.saveUTM = function (ucid, data) {
    return API.request(API_BASE_URL + '/articles/' + ucid, data, 'PUT');
};

/**
 * All API requests should call this
 * @param String url is the endpoint
 * @param Object data contains the query or body of the request
 * @param String method of request (default: GET)
 * @param String dataType specifies what type of response to fetch (default: json)
 * @return $.Deferred which will be the xhr from jQuery
 * XXX Far future, we can catch and handle offline requests here
 */
API.request = function (url, data, method, dataType) {
    return $.ajax({
        url: url || '#noop',
        data: _.extend(data, { token: apiKey }) || {},
        dataType: dataType || 'json',
        type: method || 'get',
        headers: {
            'tse-token': apiKey
        },
        error: function (data, xhr) {
            console.error('Could not complete request: ', data, xhr);
        }
    });
};
