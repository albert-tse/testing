import React, { Component, PropTypes } from 'react';
import { Button, Dialog, IconButton, List, ListItem } from 'react-toolbox';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import ListStore from '../../../stores/List.store';
import ListActions from '../../../actions/List.action';
import _ from 'lodash';

import Styles from './styles.action-buttons';

import classnames from 'classnames';

export default class AddToListButton extends Component {

    constructor(props) {
        super(props);
        this.toggleLists = this.toggleLists.bind(this);
        this.state = {
            showLists: false
        };
    }

    render() {
        let userLists = ListStore.getState().userLists;
        if (userLists === 'loading') {
            return <div />;
        }

        userLists = userLists.filter(list => list.canEdit || list.canManage);
        const props = {
            icon: !this.props.isOnCard ? 'playlist_add' : null,
            label: this.props.isOnCard ? 'Add' : 'Add to List',
            onClick: this.toggleLists,
            primary: this.props.primary
        };

        const className = classnames(
            this.props.className,
            this.props.isOnCard && Styles.isOnCard,
            this.props.isOnTable && Styles.isOnTable
        );

        return (
            <div className={className}>
                <Button className={classnames(this.props.isOnCard && Styles.mini, Styles.normal)} {...props} />
                <IconButton className={Styles.icon} {...props} />
                <Dialog
                    title="Add to List"
                    active={this.state.showLists}
                    onEscKeyDown={this.toggleLists}
                    onOverlayClick={this.toggleLists}
                >
                    <div style={{maxHeight: '25vh', overflowX: 'hidden', overflowY: 'auto'}}>
                        <List selectable ripple>
                            {
                                _.map(userLists, function(list, index){
                                    return <ListItem leftIcon="radio_button_unchecked" caption={list.list_name} onClick={evt => this.addToList(list.list_id)} key={index}/>;
                                }.bind(this))
                            }
                        </List>
                    </div>
                </Dialog>
            </div>
        );
    }

    toggleLists(evt) {
        this.setState({ showLists: !this.state.showLists });
        return evt && evt.stopPropagation();
    }

    addToList(listId) {
        var ucids = this.props.ucid;
        if(ucids == -1){
            ucids = FilterStore.getState().ucids;
            FilterActions.clearSelection();
        } else {
            ucids = [ucids];
        }

        ListActions.addToList(ucids, listId);
        this.toggleLists();
        setTimeout(this.props.closeDialog, 500);
    }
}
