import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { AppBar, IconButton } from 'react-toolbox';
import Keywords from './toolbar_components/Keywords.component';
import ArticleSorter from './toolbar_components/ArticleSorter.component';
import TopicFilter from './toolbar_components/TopicFilter.component';
import Styles from './styles';
import DrawerActions from '../../actions/Drawer.action';
import classnames from 'classnames';

export default class Toolbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const left = typeof this.props.left === 'string' ? <a className={Styles.title}>{this.props.title}</a> : this.props.left;
        const { right } = this.props;

        // Reminder to self: The reason why we're wrapping this in an AltContainer is because
        // we will eventually be listening to a Store that keeps track of selected articles.
        // When articles are selected, we switch over to a different Toolbar component instead of Filter
        return (
            <AltContainer render = {
                props => (
                    <AppBar flat={'flat' in this.props} className={classnames(Styles.spaceOut, Styles.toolbar, this.props.className && this.props.className)}>
                        <div className={Styles.actionsContainer}>
                            { left }
                        </div>
                        <div className={classnames(Styles.actionsContainer, Styles.rightContainer)}>
                            { right }
                        </div>
                    </AppBar>
                )
            } />
        );
    }
}
