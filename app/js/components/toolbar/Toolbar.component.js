import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { AppBar } from 'react-toolbox';
import Styles from './styles';
import classnames from 'classnames';

export default class Toolbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const left = typeof this.props.left == 'string' ? <a className={Styles.title}>{this.props.left}</a> : this.props.left;
        const leftNoCollapse = typeof this.props.leftNoCollapse == 'string' ? <a className={Styles.title}>{this.props.leftNoCollapse}</a> : this.props.leftNoCollapse;
        const { center, right } = this.props;

        // Reminder to self: The reason why we're wrapping this in an AltContainer is because
        // we will eventually be listening to a Store that keeps track of selected articles.
        // When articles are selected, we switch over to a different Toolbar component instead of Filter
        return (
            <AltContainer render = {
                props => (
                    <AppBar flat={'flat' in this.props} className={classnames(Styles.spaceOut, Styles.toolbar, this.props.className && this.props.className)}>
                        <div className={Styles.actionsContainer}>
                            { leftNoCollapse }
                            { left }
                        </div>
                        {typeof center !== 'undefined' &&
                            <div className={classnames(Styles.actionsContainer, Styles.centerContainer)}>
                                { center }
                            </div>
                        }
                        {typeof right !== 'undefined' &&
                            <div className={classnames(Styles.actionsContainer, Styles.rightContainer)}>
                                { right }
                            </div>
                        }
                    </AppBar>
                )
            } />
        );
    }
}
