import React from 'react';
import AltContainer from 'alt-container';
import Component from './Saved.component';
import ArticleStore from '../../stores/Article.store'
import ArticleActions from '../../actions/Article.action'
import ListStore from '../../stores/List.store'
import ListActions from '../../actions/List.action'

class Saved extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        ListActions.fetch('saved');

        // console.log('mounted');
        // ListActions.load('saved');
    }

    render() {
        return <div />;
        // return <AltContainer store={ListStore} actions={ArticleActions} component={Component} />;
        // return false; /*<AltContainer store={FeedStore} actions={ArticleActions} component={Component} />*/ ;
    }
}

export default Saved;
