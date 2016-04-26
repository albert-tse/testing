import React from 'react'
import Config from '../../config'

class GA extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                '//www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', Config.googleAnalyticsTag);
    }

    render() {
        return false;
    }
}

export default GA;
