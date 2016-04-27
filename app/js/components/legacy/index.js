import React from 'react'
import Config from '../../config'
import AuthStore from '../../stores/Auth.store'
import AuthActions from '../../actions/Auth.action'
import { Header, Toolbar } from '../shared'
import InfoBar from '../explore/infobar' // TODO: when feed/explore view is in its own component, move this import there

var legacyHTMLBlob = {
    __html: require('../../../../quarantine/build/index.html')
};

class Legacy extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.altHack = {
            auth: {
                store: AuthStore,
                actions: AuthActions
            }
        };

        var loadjs = function (d, s, id, url) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = url;
            fjs.parentNode.insertBefore(js, fjs);
        };

        loadjs(document, 'script', 'foundation', 'js/legacy/foundation.js');
        var wait = setInterval(function () {
            if (window.angular) {
                loadjs(document, 'script', 'legacy-app', 'js/legacy/app.js');
                clearInterval(wait);
            }
        }, 10);
    }

    render() {
        return (
            <div id="app">
            <link rel='stylesheet' href='css/legacy.css' />
            <Header />
            <Toolbar />
            <div className="container-fluid">
                <div dangerouslySetInnerHTML={legacyHTMLBlob} />
                <InfoBar />
            </div>
        </div>
        );
    }
}

export default Legacy;
