/* DO NOT EDIT THIS FILE */
var config =
    /* config object start */
{
    "facebookPermissions": "public_profile,user_friends,email",
    "googleAnalyticsTag": "GTM-MB6MXG",
    "googleClientId": "713042056852-vio2jnjfs89v7rnuirhm9pff7s3o0lqj.apps.googleusercontent.com",
    "googleAuthScope": "profile email",
    "authStorageToken": "contempo_auth_store",
    "userStorageToken": "contempo_user_store",
    "authLevels": {
        "none": "contempo_perm_none",
        "pending": "contempo_perm_pending",
        "authenticated": "contempo_perm_authenticated"
    },
    "routes": {
        "login": "/login",
        "explore": "/explore",
        "shared": "/shared",
        "default": "/",
        "recommended": "/recommended",
        "related": "/related/:id",
        "articles": "/articles/:ids",
        "signup": "/signup",
        "saved": "/saved",
        "settings": "/settings",
        "trending": "/trending",
        "links": "/links"
    },
    "shortlinkHostname": "http://qklnk.co/",
    "curTOSVersion": "1",
    "platforms": {
        "1": {
            "id": 1,
            "url": "twitter.com",
            "name": "Twitter"
        },
        "2": {
            "id": 2,
            "url": "facebook.com",
            "name": "Facebook"
        },
        "3": {
            "id": 3,
            "url": "tumblr.com",
            "name": "Tumblr"
        },
        "4": {
            "id": 4,
            "url": "amazon.com",
            "name": "Amazon"
        },
        "6": {
            "id": 6,
            "url": "pinterest.com",
            "name": "Pinterest"
        },
        "7": {
            "id": 7,
            "url": "plus.google.com",
            "name": "Google +"
        },
        "8": {
            "id": 8,
            "url": "email.com",
            "name": "Email"
        }
    },
    "facebookAppId": "585424068290849",
    "apiUrl": "http://geordi.dev:3000",
    "contempoUrl": "http://contempo.dev:9000/",
    "debug": true
}    
/* config object end */
;

export default config;
