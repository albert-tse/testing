import React, { Component, PropTypes } from 'react';
import { List } from 'react-toolbox';

import Influencer from './Influencer.component';

export default class MultiInfluencerSelector extends Component {

    constructor(props) {
        super(props);
        this.onInfluencerChange = this.onInfluencerChange.bind(this);
        this.onChange = this.props.onChange;
        this.state = {
            selected: [] // should contain only selected platforms
        };
    }

    render() {
        return (
            <List>
                {this.props.influencers.map(influencer => <Influencer key={influencer.name} {...influencer} onChange={this.onInfluencerChange} />)}
            </List>
        );
    }

    onInfluencerChange(changes) {
        console.log(changes);
        this.onChange && this.onChange(this.state);
    }
}

MultiInfluencerSelector.defaultProps = {
    influencers: [
        {
            id: 3,
            name: 'TSE Influencers',
            platforms: [
                {
                    id: 1,
                    avatar: 'https://graph.facebook.com/georgehtakei/picture?height=180&width=180',
                    name: 'George Takei',
                    type: 'Facebook Page'
                }, {
                    id: 2,
                    avatar: 'https://graph.facebook.com/Ashton/picture?height=180&width=180',
                    name: 'Ashton',
                    type: 'Facebook Page'
                }
            ]
        }, {
            id: 4,
            name: 'Brad Takei',
            platforms: [
                {
                    id: 10,
                    avatar: 'https://graph.facebook.com/bradandgeorge/picture?height=180&width=180',
                    name: 'Brad Takei',
                    type: 'Facebook Page'
                }
            ]
        }
    ]
};
