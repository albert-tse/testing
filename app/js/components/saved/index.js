import React from 'react';
import AltContainer from 'alt-container';
//import Component from './Saved.component';
//import FeedStore from '../../stores/Feed.store';
import ArticleStore from '../../stores/Article.store'
import ArticleActions from '../../actions/Article.action'
import ListStore from '../../stores/List.store'
import ListActions from '../../actions/List.action'

class Saved extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('mounted');
        ListActions.load('saved');
    }

    render() {
        return false; /*<AltContainer store={FeedStore} actions={ArticleActions} component={Component} />*/ ;
    }
}

export default Saved;
