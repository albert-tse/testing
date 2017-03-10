import React, { Component } from 'react';
import { Dialog, IconMenu, MenuItem } from 'react-toolbox';

import ListActions from '../../../actions/List.action';

import Overlay from '../../shared/Overlay.component';
import theme from './styles.manage-list';

/**
 * A dropdown menu that is shown on each list view
 * Use this to place any actions that can modify the list such as
 * Clearing content, renaing, and deleting the list itself
 */
export default class ManageList extends Component {

    /**
     * Bind all instance methods here
     * @param {Object} props not used yet
     * @return {ManageList}
     */
    constructor(props) {
        super(props);
        this.callAction = this.callAction.bind(this);
        this.clearStories = this.clearStories.bind(this);
        this.renameList = this.renameList.bind(this);
        this.deleteList = this.deleteList.bind(this);

        this.state = {
            confirmingClearStories: false
        };
    }

    /**
     * Display component
     * @return {JSX}
     */
    render() {
        return (
            <div>
                <IconMenu
                    theme={theme}
                    icon="settings"
                    onSelect={this.callAction}
                >
                    <MenuItem caption="Clear Stories" value={this.clearStories} />
                    <MenuItem caption="Rename List" value={this.renameList} />
                    <MenuItem caption="Delete List" value={this.deleteList} />
                </IconMenu>
                <Overlay>
                    <Dialog
                        active={this.state.confirmingClearStories}
                        onOverlayClick={this.toggle.bind(this, 'confirmingClearStories')}
                        onEscKeyDown={this.toggle.bind(this, 'confirmingClearStories')}
                        actions={[
                            {
                                label: 'Clear Stories',
                                onClick: this.clearStories.bind(this, true),
                                raised: true,
                                accent: true
                            },
                            {
                                label: 'Cancel',
                                onClick: this.toggle.bind(this, 'confirmClearStories')
                            }
                        ]}>
                        <p className={theme.prompt}>Are you sure you want to delete all the stories in this list?</p>
                    </Dialog>
                </Overlay>
            </div>
        );
    }

    /**
     * Toggle a specific state property
     * @param {String} key name
     */
    toggle(key) {
        this.setState({ [key]: !this.state[key] });
    }

    /**
     * Calls the selected function set within the menu item
     * @param {Function} action to exeecute
     */
    callAction(action) {
        action();
    }

    /**
     * Tells List to rmeove all stories that are saved in this list
     */
    clearStories(hasConfirmed) {
        if (hasConfirmed) {
            ListActions.clearStories();
        }

        this.toggle('confirmingClearStories');
    }

    /**
     * Rename the list
     */
    renameList() {
        console.log('I want to rename this list');
    }

    /**
     * Delete the list
     */
    deleteList() {
        console.log('I want to delete this list');
    }
}
