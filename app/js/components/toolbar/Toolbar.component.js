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
        var leftSection = typeof this.props.leftSection === 'string' ? <a className={Styles.leftSection}>{this.props.leftSection}</a> : this.props.leftSection;

        // Reminder to self: The reason why we're wrapping this in an AltContainer is because
        // we will eventually be listening to a Store that keeps track of selected articles.
        // When articles are selected, we switch over to a different Toolbar component instead of Filter
        return (
            <AltContainer render = {
                props => (
                    <AppBar className={classnames(Styles.spaceOut, Styles.toolbar, this.props.className && this.props.className)}>
                        <div className={Styles.actionsContainer}>
                            { leftSection }
                        </div>
                        <div className={Styles.actionsContainer}>
                            { this.props.rightSection }
                        </div>
                    </AppBar>
                )
            } />
        );
    }
}
