import React, { Component } from 'react';
import AltContainer from 'alt-container';
import CollapsibleButton from './CollapsibleButton.component';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import ListActions from '../../../actions/List.action';
import ListStore from '../../../stores/List.store';

export default class Container extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={removeAllButton}
                stores={ {filters: FilterStore, lists: ListStore} }
            />
        );
    }
}

function getList(listId){
    if(typeof listId == 'string'){
        return ListStore.getSpecialList(listId);
    }else{
        return ListStore.getList(listId);
    }
}

class removeAllButton extends Component {
    constructor(props) {
        super(props);

        this.state={
            list:  getList(this.props.filters.selectedList)
        }
    }

    shouldComponentUpdate(nextProps) {
        return this.props.filters.selectedList !== nextProps.filters.selectedList ||
            getList(this.props.filters.selectedList) !== getList(nextProps.filters.selectedList);
    }

    componentWillUpdate(nextProps) {
        this.state={
            list:  getList(nextProps.filters.selectedList)
        }
    }

    render() {
        var styles = this.state.list.canEdit ? '' : 'hidden';
        return (
            <CollapsibleButton className={styles} icon="remove_circle_outline" label={this.props.label || "Remove Selected"} onClick={::this.removeFromList} />
        );
    }

    removeFromList() {
        var ucids = FilterStore.getState().ucids;
        var listId = this.state.list.list_id;
        ListActions.removeFromList(ucids, listId);
        FilterActions.clearSelection();
    }
}