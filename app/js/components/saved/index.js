import React from 'react';
import AltContainer from 'alt-container';
import Component from './Saved.component';
import FeedStore from '../../stores/Feed.store';

class Saved extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="saved" class="tab-content">
                <AltContainer store={FeedStore} component={Component} />
            </div>
        );
    }
}

export default Saved;
