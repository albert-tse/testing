import React, { Component } from 'react';
import CollapsibleButton from './CollapsibleButton.component';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import ListActions from '../../../actions/List.action';
import ListStore from '../../../stores/List.store';

export default class removeAllButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CollapsibleButton icon="remove_circle_outline" label={this.props.label || "Remove All"} onClick={::this.removeFromList} />
        );
    }

    removeFromList() {
        var ucids = FilterStore.getState().ucids;
        var listId = FilterStore.getState().selectedList;

        if(typeof listId == 'string'){
            listId = ListStore.getSpecialList(listId).list_id;
        }

        ListActions.removeFromList(ucids, listId);
        FilterActions.clearSelection();
    }
}