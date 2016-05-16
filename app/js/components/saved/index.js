import React from 'react';
import AltContainer from 'alt-container';
import Component from '../shared/List.component';
import ListStore from '../../stores/List.store'
import ListActions from '../../actions/List.action'

class Saved extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        ListActions.getSavedList();
    }

    render() {
        return <AltContainer listName = "saved"
        stores = {
            {
                list: (props) => {
                    return {
                        store: ListStore,
                        value: ListStore.getSavedList()
                    };
                }
            }
        }
        actions = { ListActions }
        component = { Component }
        />;
    }
}

export default Saved;
