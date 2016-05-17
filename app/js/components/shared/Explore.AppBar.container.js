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
        this.onChange = this.onChange.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
        this.changedView = this.state.title !== nextState.title;
    }

    componentDidUpdate() {
        this.changedView && refreshMDL();
    }

    componentDidMount() {
        Store.listen(this.onChange);
    }

    componentWillUnmount() {
        Store.unlisten(this.onChange);
    }

    render() {
        var isSelectingArticles = this.state.selectedArticles.length > 0;
        return (
            <AppBar 
                className={isSelectingArticles && 'selection-mode'}
                title={isSelectingArticles ? 'Clear Selection' : this.getTitle() }
                actions={isSelectingArticles ? <div /> : BrowseActions} />
        );
    }

    onChange(state) {
        console.log(this.state);
        this.setState(state);
    }

    getTitle() {
        return this.state.title || 'Explore';
    }
}

export default ExploreAppBar;
