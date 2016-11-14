import React, { Component, PropTypes } from 'react';
import { Button, Dialog, IconButton, List, ListItem } from 'react-toolbox';
import ListStore from '../../../stores/List.store';
import ListActions from '../../../actions/List.action';

import Styles from './styles.action-buttons';

export default class AddToListButton extends Component {

    constructor(props) {
        super(props);
        this.toggleLists = this.toggleLists.bind(this);
        this.state = {
            showLists: false
        };
    }

    render() {
        const { userLists } = ListStore.getState();
        const props = {
            icon: 'playlist_add',
            label: 'Add to List',
            onClick: this.toggleLists
        };

        return (
            <div>
                <Button className={Styles.normal} {...props} />
                <IconButton className={Styles.icon} {...props} />
                <Dialog
                    title="Add to List"
                    active={this.state.showLists}
                    onEscKeyDown={this.toggleLists}
                    onOverlayClick={this.toggleLists}
                >
                    <div style={{maxHeight: '25vh', overflowX: 'hidden', overflowY: 'auto'}}>
                        <List selectable ripple>
                            {userLists.map(list => <ListItem leftIcon="radio_button_unchecked" caption={list.list_name} onClick={evt => this.addToList(list.list_id)} />)}
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
        ListActions.addToList([this.props.ucid], listId);
        this.toggleLists();
    }
}
