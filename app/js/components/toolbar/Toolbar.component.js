import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { AppBar, IconButton } from 'react-toolbox';
import Keywords from './toolbar_components/Keywords.component';
import ArticleSorter from './toolbar_components/ArticleSorter.component';
import DateRangeFilter from './toolbar_components/DateRangeFilter.component';
import TopicFilter from './toolbar_components/TopicFilter.component';
import Styles from './styles';
import DrawerActions from '../../actions/Drawer.action';
import classnames from 'classnames';

export default class Toolbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var titleComponent = typeof this.props.title === 'string' ? <a className={Styles.title}>{this.props.title}</a> : this.props.title;

        // Reminder to self: The reason why we're wrapping this in an AltContainer is because
        // we will eventually be listening to a Store that keeps track of selected articles.
        // When articles are selected, we switch over to a different Toolbar component instead of Filter
        return (
            <AltContainer render = {
                props => (
                    <AppBar className={classnames(Styles.spaceOut, Styles.toolbar, this.props.className && this.props.className)}>
                        { titleComponent }
                        <div className={Styles.actionsContainer}>
                            { this.props.children }
                        </div>
                    </AppBar>
                )
            } />
        );
    }
}
