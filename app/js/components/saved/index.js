import React from 'react';
import AltContainer from 'alt-container';
import Component from './Saved.component';
import ArticleStore from '../../stores/Article.store'
import ArticleActions from '../../actions/Article.action'
import ListStore from '../../stores/List.store'
import ListActions from '../../actions/List.action'

// XXX: We may actually need to make this more generic like List container with
// 'saved' passed as param
// if we're going to be adding other lists like Tom's List
class Saved extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {}

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
