import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { AppBar, Dropdown  } from 'react-toolbox';
import Styles from './styles';
import classnames from 'classnames';

export default class MobileToolbar extends Component {
    constructor(props) {
        super(props);
    }

    customItem(item) {
        return (
                <div>
                    {item}
                </div>
            );
    }

    render() {
        const left = typeof this.props.left == 'string' ? <a className={Styles.title}>{this.props.left}</a> : this.props.left;
        const { right } = this.props;

        let menuTitle = this.props.mobileTitle || 'Menu';
        let menuItems = false;

        if (_.isArray(left)) {
            menuItems = [menuTitle, ...left];
        } else {
            menuItems = [menuTitle, left];
        }

        // Reminder to self: The reason why we're wrapping this in an AltContainer is because
        // we will eventually be listening to a Store that keeps track of selected articles.
        // When articles are selected, we switch over to a different Toolbar component instead of Filter
        return (
            <AltContainer render = {
                props => (
                    <AppBar flat={'flat' in this.props} className={classnames(Styles.spaceOut, Styles.toolbar, Styles.mobileToolbar, this.props.className && this.props.className)}>
                        <div className={Styles.actionsContainer}>
                            <Dropdown
                                className={Styles.mobileMenu}
                                auto={false}
                                source={menuItems}
                                template={this.customItem}
                              />
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
