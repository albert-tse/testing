import React from 'react';
import Config from '../../config';
import ArticleStore from '../../stores/Article.store';
import ArticleActions from '../../actions/Article.action';
import AuthStore from '../../stores/Auth.store';
import AuthActions from '../../actions/Auth.action';
import ListStore from '../../stores/List.store';
import ListActions from '../../actions/List.action';
import { Toolbar } from '../shared';
import InfoBarContainer from '../explore/InfoBar.container';
import InfoBarActions from '../../actions/InfoBar.action';
import NotificationActions from '../../actions/Notification.action';

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
            },
            list: {
                store: ListStore,
                actions: ListActions
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

        // Listen for custom events dispatched by the legacy code
        window.addEventListener('sharedArticle', this.onSharedArticle);
        window.addEventListener('savedArticle', this.onSavedArticle);
        window.addEventListener('removeSavedArticle', this.onRemoveSavedArticle);
        window.addEventListener('getSavedArticles', this.onGetSavedArticles);
    }

    componentWillUnmount() {
        if (window.exploreApp) {
            $(document.body).off(); // assuming only the legacy code bound events using jQuery, it shouldn't affect the components that are currently mounted
            window.removeEventListener('sharedArticle', this.onSharedArticle);
            window.removeEventListener('savedArticle', this.onSavedArticle);
            window.removeEventListener('getSavedArticles', this.onGetSavedArticles);
        }
    }

    componentDidUpdate() {
        // Assume we switched from different Browse views
        // We want to fetch new content because this will not call exploreApp.initialize()
        var pathname = this.props.location.pathname;
        feed.search.trending = /trending/.test(pathname);
        feed.search.relevant = /recommended/.test(pathname);
        exploreApp.loadContent(feed.search);

        // We also want to re-initialize the daterange picker because it was removed
        exploreApp.initDatePicker();
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

    /**
     * Dispatch an Article action on behalf of the legacy code
     * @param CustomEvent evt is dispatched from legacy code with payload inside evt.detail
     */
    onSharedArticle(evt) {
        console.log(ListActions, ' ', this);
        ListActions.addToSavedList([evt.detail.linkPayload.ucid]);
        NotificationActions.add('Copied the link to the clipboard.');
    };

   /**
    * Dispatch a List action to save an article to the saved list 
    * @param CustomEvent evt is dispatched from legacy code with payload containing ucid of article inside evt.detail
    */
    onSavedArticle(evt) {
        var { ucid, articleElement } = evt.detail;
        ListActions.addToSavedList([ucid]);
        articleElement.querySelector('.save-article i').innerText = 'bookmark';
        NotificationActions.add('Saved article to list');
        return evt.stopPropagation();
    };

   /**
    * Dispatch a List action to save an article to the saved list 
    * @param CustomEvent evt is dispatched from legacy code with payload containing ucid of article inside evt.detail
    */
    onRemoveSavedArticle(evt) {
        var { ucid, articleElement } = evt.detail;
        ListActions.removeFromSavedList([ucid]);
        articleElement.querySelector('.save-article i').innerText = 'bookmark_border';
        NotificationActions.add('Removed article from saved articles');
        return evt.stopPropagation();
    };

    /**
     * This is an event dispatched by the legacy code
     * requesting for a list of saved articles so that it can mark its articles to be either saved/not saved
     * @param CustomEvent evt dispatched from legacy code containing:
     * @param Array evt.detail.ucidsToMatch ucids of articles that the legacy code just loaded into the grid
     * @param Function evt.detail.next expects to receive an array of ucids that are in saved list
     */
    onGetSavedArticles(evt) {
        var { ucidsToMatch, next } = evt.detail;
        console.log('Store', ListStore.getState(), 'ucids', ucidsToMatch);
        // XXX What's the best way to pass intersection of ucidsToMatch and ListStore.getState().lists[:savedListId] ?
    };

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
