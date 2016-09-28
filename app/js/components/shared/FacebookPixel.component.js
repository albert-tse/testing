import React, { Component } from 'react';
import History from '../../history';

export default class FacebookPixel extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '113554235655568');
        fbq('track', 'PageView');
        /success$/.test(window.location.hash) && fbq('track', 'CompleteRegistration');
    }

    componentDidUpdate() {
        fbq('track', 'PageView');
        /success$/.test(window.location.hash) && fbq('track', 'CompleteRegistration');
    }


    render() {
        return (
            <noscript><img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=113554235655568&ev=PageView&noscript=1" /></noscript>
        );
    }
}
