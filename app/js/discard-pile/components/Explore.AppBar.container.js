import React from 'react';
import AltContainer from 'alt-container';
import AppBar, { AppBars, BrowseActions } from './AppBar.component';
import AppBarActions from '../../actions/AppBar.action';
import NotificationStore from '../../stores/Notification.store';
import ListStore from '../../stores/List.store';
import ListActions from '../../actions/List.action';
import Store from '../../stores/Explore.AppBar.store';
import { refreshMDL } from '../../utils';

class ExploreAppBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = Store.getState();
        this.changedView = false;
        this.onChange = this.onChange.bind(this); // I had to do this instead of ::this because it wouldn't stop listening to store when unmounting
    }

    componentDidMount() {
        Store.listen(this.onChange);
    }

    componentWillUnmount() {
        Store.unlisten(this.onChange);
    }


    componentWillUpdate(nextProps, nextState) {
        this.changedView = this.state.title !== nextState.title;
    }

    componentDidUpdate() {
        this.changedView && refreshMDL();
    }

    render() {
        var isSelectingArticles = this.state.selectedArticles.length > 0;
        return (
            <AppBar 
                className={isSelectingArticles && 'selection-mode'}
                title={this.renderTitle(isSelectingArticles)}
                actions={isSelectingArticles ? SelectionActions(::this.saveToList, ::this.shareSelected) : BrowseActions} />
        );
    }

    onChange(state) {
        this.setState(state);
    }

    renderTitle(isSelectingArticles) {
        if (isSelectingArticles) {
            return TitleWithIcon('clear', 'Clear Selection', Store.clearSelection);
        }
        else {
            return this.state.title || 'Explore';
        }
    }

    saveToList() {
        var {selectedArticles} = this.state;
        ListActions.addToSavedList(selectedArticles);
        NotificationStore.add(`Saved ${selectedArticles.length} articles`);
    }

    shareSelected() {
        var {selectedArticles} = this.state;
        var pathname = `?ucid=${selectedArticles.join()}`;
        var linkToShare = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/${pathname}`;
        var el = document.createElement('input');

        document.body.appendChild(el);
        el.value = linkToShare;
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        NotificationStore.add('Copied permalink');
    }

}

const SelectionActions = (saveToList, shareSelected) => (
    <div className="mdl-actions">
        <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onClick={saveToList}>
            <i className="material-icons">bookmark_border</i>
        </button>
        <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onClick={shareSelected}>
            <i className="material-icons">share</i>
        </button>
    </div>
);

// XXX If we need to use this again for another AppBar then let's move it to a small component
const TitleWithIcon = (iconName, title, action) => (
    <label>
        <button className="mdl-button mdl-js-button mdl-button--icon" onClick={action}>
            <i className="material-icons">{iconName}</i>
        </button>
        <span className="mdl-layout-title">{title}</span>
    </label>
);

export default ExploreAppBar;
