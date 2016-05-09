import React from 'react';
import AltContainer from 'alt-container';
//import Component from './Saved.component';
//import FeedStore from '../../stores/Feed.store';
import ArticleActions from '../../actions/Article.action';

class Saved extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return false; /*<AltContainer store={FeedStore} actions={ArticleActions} component={Component} />*/ ;
    }
}

export default Saved;
