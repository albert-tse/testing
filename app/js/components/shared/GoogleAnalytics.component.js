import React, { Component } from 'react';
import Config from '../../config';

import UserStore from '../../stores/User.store';

export default class GoogleAnalytics extends Component {

    constructor(props) {
        super(props);
        window.dataLayer = [];
    }

    componentDidMount() {
        if (Config.googleAnalyticsTag) {
            (function(w,d,s,l,i,u) {
                w[l]=w[l]||[];
                w[l].push({
                    'gtm.start': new Date().getTime(),
                    'ctm.userId': u && u.id,
                    'ctm.userRole': u && u.role,
                    'ctm.referrer': u && u.referrer,
                    event:'gtm.js'
                });
                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),
                    dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', Config.googleAnalyticsTag, UserStore.getState().user);
        }
    }

    render() {
        return null;
        /*
        if (Config.debug) {
            return false;
        } else {
            return (
                <noscript>
                    <iframe
                        src={`//www.googletagmanager.com/ns.html?id=${Config.googleAnalyticsTag}`}
                        height={0}
                        width={0}
                        style={{
                            'display': 'none',
                            'visibility': 'hidden'
                        }} />
                </noscript>
            );
        }
        */
    }
}

export function pushEvent(data) {
    if (window && Array.isArray(window.dataLayer)) {
        window.dataLayer.push(data);
    }
}
