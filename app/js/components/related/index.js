import React from 'react';
import AltContainer from 'alt-container';
import Component from '../shared/List.component';
import ListStore from '../../stores/List.store'
import ListActions from '../../actions/List.action'

class Related extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        ListActions.getRelatedToList(605754);
    }

    render() {
        return <AltContainer listName = "related"
        stores = {
            {
                list: (props) => {
                    return {
                        store: ListStore,
                        value: ListStore.getRelatedToList(605754)
                    };
                }
            }
        }
        actions = { ListActions }
        component = { Component }
        />;
    }
}

export default Related;
