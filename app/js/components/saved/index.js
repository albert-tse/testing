import React from 'react';
import AltContainer from 'alt-container';
import Component from './Saved.component';
import FeedStore from '../../stores/Feed.store';

class Saved extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <AltContainer store={FeedStore} component={Component} />;
    }
}

export default Saved;
