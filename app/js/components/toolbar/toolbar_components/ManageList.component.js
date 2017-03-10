import React, { Component } from 'react';
import { Dialog, IconMenu, Input, MenuItem } from 'react-toolbox';

import FilterStore from '../../../stores/Filter.store';
import ListActions from '../../../actions/List.action';
import ListStore from '../../../stores/List.store';

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
        this.ConfirmClearStoriesDialog = this.ConfirmClearStoriesDialog.bind(this);
        this.RenameListDialog = this.RenameListDialog.bind(this);
        this.updateNewListName = this.updateNewListName.bind(this);
        this.ConfirmDeleteListDialog = this.ConfirmDeleteListDialog.bind(this);

        this.state = {
            confirmingClearStories: false,
            renamingList: false,
            newListName: '',
            confirmingDeleteList: false
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
                    <this.ConfirmClearStoriesDialog />
                    <this.RenameListDialog />
                    <this.ConfirmDeleteListDialog />
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
     * @param {Boolean} hasConfirmed if caller passes true, then call List action
     */
    renameList(hasConfirmed) {
        if (hasConfirmed) {
            ListActions.renameList(this.state.newListName);
        }

        let { selectedList } = FilterStore.getState();
        selectedList = ListStore.getList(selectedList);
        this.setState({
            newListName: selectedList.list_name,
            renamingList: !this.state.renamingList
        });
    }

    /**
     * Delete the list
     * @param {Boolean} hasConfirmed if caller passed true that means we want it to persist
     */
    deleteList(hasConfirmed) {
        if (hasConfirmed) {
            ListActions.deleteList();
        }

        this.toggle('confirmingDeleteList');
    }

    /**
     * Dialog for clearing stories
     * @return {JSX}
     */
    ConfirmClearStoriesDialog() {
        return (
            <Dialog
                active={this.state.confirmingClearStories}
                onOverlayClick={this.toggle.bind(this, 'confirmingClearStories')}
                onEscKeyDown={this.toggle.bind(this, 'confirmingClearStories')}
                actions={[
                    {
                        label: 'Clear Stories',
                        onClick: this.clearStories.bind(this, true),
                        primary: true
                    },
                    {
                        label: 'Cancel',
                        onClick: this.toggle.bind(this, 'confirmingClearStories')
                    }
                ]}>
                <p className={theme.prompt}>Are you sure you want to delete all the stories in this list?</p>
            </Dialog>
        );
    }

    /**
     * Dialog for renaming a list
     * @return {JSX}
     */
    RenameListDialog() {
        return (
            <Dialog
                active={this.state.renamingList}
                title="Rename List"
                onOverlayClick={this.toggle.bind(this, 'renamingList')}
                onEscKeyDown={this.toggle.bind(this, 'renamingList')}
                actions={[
                    {
                        label: 'Rename',
                        onClick: this.renameList.bind(this, true),
                        primary: true

                    },
                    {
                        label: 'Cancel',
                        onClick: this.toggle.bind(this, 'renamingList')
                    }
                ]}
            >
                <Input
                    value={this.state.newListName}
                    onChange={this.updateNewListName}
                />
            </Dialog>
        );
    }

    /**
     * Update the value of the list name
     * @param {String} val proposed list name
     */
    updateNewListName(val) {
        this.setState({
            newListName: val
        });
    }

    /**
     * Confirm that user wants to delete the list
     * @return {JSX}
     */
    ConfirmDeleteListDialog() {
        return (
            <Dialog
                active={this.state.confirmingDeleteList}
                title="Delete List"
                onOverlayClick={this.toggle.bind(this, 'confirmingDeleteList')}
                onEscKeyDown={this.toggle.bind(this, 'confirmingDeleteList')}
                actions={[
                    {
                        label: 'Delete',
                        onClick: this.deleteList.bind(this, true),
                        primary: true
                    }, {
                        label: 'Cancel',
                        onClick: this.toggle.bind(this, 'confirmingDeleteList')
                    }
                ]}
            >
                <p className={theme.prompt}>Are you sure you want to delete this list?</p>
            </Dialog>
        );
    }

}
