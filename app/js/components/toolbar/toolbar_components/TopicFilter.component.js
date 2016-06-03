import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Dropdown } from 'react-toolbox';
import FilterActions from '../../../actions/Filter.action';
import SearchActions from '../../../actions/Search.action';
import _ from 'lodash';

export default class TopicFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            topic: topics[0].value // TODO: Save the state to localStorage via User.store
        };
    }

    render() {
        return (
            <AltContainer
                actions={ props => ({
                    onChange: value => {
                        this.setState({ topic: value });
                        var selectedFilter = _.find(topics, { value: value });
                        FilterActions.update(selectedFilter.filters);
                        SearchActions.getResults();
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
        value: 'all',
        filters: { trending: false, relevant: false }
    },
    {
        label: 'Trending',
        value: 'trending',
        filters: { trending: true, relevant: false }
    },
    {
        label: 'Relevant',
        value: 'topics',
        filters: { trending: false, relevant: true }
    },
    {
        label: 'Recommended',
        value: 'recommended',
        filters: { trending: true, relevant: true }
    }
];
