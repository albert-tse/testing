import React from 'react';
import AltContainer from 'alt-container';
import AppBar, { AppBars, BrowseActions } from './AppBar.component';
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
                actions={isSelectingArticles ? SelectionActions : BrowseActions} />
        );
    }

    onChange(state) {
        console.log(this.state);
        this.setState(state);
    }

    renderTitle(isSelectingArticles) {
        if (isSelectingArticles) {
            return TitleWithIcon('clear', 'Clear Selection');
        }
        else {
            return this.state.title || 'Explore';
        }
    }

}

const SelectionActions = (
    <div className="mdl-actions">
        <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
            <i className="material-icons">bookmark_border</i>
        </button>
        <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
            <i className="material-icons">share</i>
        </button>
    </div>
);

// XXX If we need to use this again for another AppBar then let's move it to a small component
const TitleWithIcon = (iconName, title) => (
    <label>
        <button className="mdl-button mdl-js-button mdl-button--icon">
            <i className="material-icons">{iconName}</i>
        </button>
        <span className="mdl-layout-title">{title}</span>
    </label>
);

export default ExploreAppBar;
