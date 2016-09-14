import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import ListActions from '../../../actions/List.action';
import { clearAllButton } from './styles.clear-saved-articles-button';
import Dialog from '../../shared/Dialog.component';

export default class ClearSavedArticlesButton extends Component {
    constructor(props) {
        super(props);
        this.toggleConfirmationDialog = this.toggle.bind(this, 'confirm');

        this.actions = [
            {
                label: 'YES CLEAR ALL',
                onClick: () => {
                    ListActions.clearSavedList();
                    this.toggleConfirmationDialog();
                }
            },
            {
                label: 'NO TAKE ME BACK',
                onClick: this.toggleConfirmationDialog
            }
        ];

        this.state = {
            confirm: false
        };
    }

    render() {
        return (
            <div>
                <Button
                    className={clearAllButton}
                    icon="clear"
                    label="Clear All"
                    onClick={this.toggleConfirmationDialog}
                />
                <Dialog
                    active={this.state.confirm}
                    actions={this.actions}
                    content={<p>Are you sure you would like to clear all your posts?<br /> This cannot be undone.</p>}
                    toggleHandler={this.toggleConfirmationDialog}
                />
            </div>
        );
    }

    toggle(stateKey) {
        this.setState({ [stateKey]: !this.state[stateKey] });
    }
}
