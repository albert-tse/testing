import React from 'react';
import Config from '../../config';
import AuthStore from '../../stores/Auth.store';
import AuthActions from '../../actions/Auth.action';
import { Toolbar } from '../shared';
import InfoBarContainer from '../explore/InfoBar.container';
import InfoBarActions from '../../actions/InfoBar.action';

var legacyHTMLBlob = {
    __html: require('../../../../quarantine/build/index.html')
};

class Legacy extends React.Component {

    constructor(props) {
        super(props);
        console.log('My props are', this.props);
    }

    componentDidMount() {
        window.altHack = {
            auth: {
                store: AuthStore,
                actions: AuthActions
            }
        };

        if (window.exploreApp) {
            exploreApp.initialize();
        } else {
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

            loadjs(document, 'script', 'foundation', Config.legacyFoundationJS);
            loadjs(document, 'script', 'legacy-app', Config.legacyAppJS);
        }

        this.listenForInfoButton();
        // this.initInfiniteScroller();
        $('#selectable').empty();
    }

    componentDidUpdate() {
        // Assume we switched from different Browse views
        // We want to fetch new content because this will not call exploreApp.initialize()
        var pathname = this.props.location.pathname;
        feed.search.trending = /trending/.test(pathname);
        feed.search.relevant = /recommended/.test(pathname);
        exploreApp.loadContent(feed.search);
    }

    render() {
        return (
            <div>
                <link rel='stylesheet' href={Config.legacyCSS} />
                {/*<Toolbar type="explore" />*/}
                <div className="container-fluid row">
                    <div dangerouslySetInnerHTML={legacyHTMLBlob} />
                    <InfoBarContainer />
                </div>
            </div>
        );
    }

    /**
     * Listen for user clicking on the info button inside an article
     * TODO: Remove when we have a feed component
     */
    listenForInfoButton() {
        $(document.body).on('click', '.article .info', function (evt) {
            InfoBarActions.toggle(exploreApp.getInfo.call(this, evt));
            return evt.stopPropagation();
        });
    }

    /**
     * In the future we'll use an Infinite scroller react component which will
     * swap in/out elements that are outside of the frame
     * TODO: Remove when we have a react component for scrolling
     */
    initInfiniteScroller() {
        if (document) {
            $(document).on('scroll', checkIfBottomReached);
        }
        else {
            console.warn('The DOM is not available');
        }
    }

}

// TODO: remove once react component infinite scroller is added
var checkIfBottomReached = _.throttle(function (evt) {
    var $pane = $(this);
    var buffer = 100; // in pixels
    if (this.body.scrollHeight - $pane.scrollTop() <= window.innerHeight + buffer) {
        exploreApp.searchMoreContent();
    }
}, 1000);

export default Legacy;
