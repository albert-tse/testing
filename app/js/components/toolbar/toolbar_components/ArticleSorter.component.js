import React, { Component } from 'react';
import AltContainer from 'alt-container';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import SearchStore from '../../../stores/Search.store';
import SearchActions from '../../../actions/Search.action';
import { FontIcon, Dropdown } from 'react-toolbox';

export default class ArticleSorter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sort: sortOptions[0].value
        };
    }

    render() {
        return (
            <AltContainer
                actions={ props => ({
                    onChange: value => {
                        this.setState({ sort: value });
                        value = value === 'random' ? '_rand_' + parseInt(1e4 * Math.random()) + ' desc' : value;
                        FilterActions.update({ sort: value });
                        SearchActions.getResults();
                    }
                })} >
                <Dropdown
                    auto
                    label="Sort by"
                    source={sortOptions}
                    value={this.state.sort} />
            </AltContainer>
        );
    }
}

const sortOptions = [
    {
        value: 'random',
        label: 'Random'
    },
    {
        value: 'stat_type_95 desc',
        label: 'Performance'
    },
    {
        value: 'creation_date desc',
        label: 'Date Published'
    },
    {
        value: 'ucid desc',
        label: 'Date Added'
    },
    {
        value: '_score desc',
        label: 'Relevance'
    },
    {
        value: 'site_id desc',
        label: 'Site'
    },
    {
        value: 'title asc',
        label: 'Title'
    }
];
