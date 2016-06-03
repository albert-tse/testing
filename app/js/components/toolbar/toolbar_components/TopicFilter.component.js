import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Dropdown } from 'react-toolbox';

// TODO: Find out how to change from related articles to trending. Is it via FilterStore or ListStore?
export default class TopicFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            topic: topics[0].value
        };
    }

    render() {
        return (
            <AltContainer
                actions={ props => ({
                    onChange: value => {
                        console.log('Got this option', value);
                    }
                })}
            >
                <Dropdown 
                    auto
                    label="Explore"
                    source={topics}
                    value={this.state.topic}
                />
            </AltContainer>
        );
    }
}

const topics = [
    {
        label: 'All Topics',
        value: 'default'
    },
    {
        label: 'Trending',
        value: 'trending'
    },
    {
        label: 'Recommended',
        value: 'recommended'
    }
];
