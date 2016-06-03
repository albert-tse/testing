import React, { Component } from 'react';
import AltContainer from 'alt-container';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import SearchStore from '../../../stores/Search.store';
import SearchActions from '../../../actions/Search.action';
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox';
import Styles from '../styles.toolbar';

export default class ArticleSorter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                actions={ props => ({
                    onSelect: newValue => {
                        this.setState({ sort: newValue });
                        newValue = newValue === 'random' ? '_rand_' + parseInt(1e4 * Math.random()) + ' desc' : newValue;
                        FilterActions.update({ sort: newValue });
                        SearchActions.getResults();
                    }
                })} >
                <IconMenu icon="sort" className={Styles.defaultColor}>
                    {sortOptions.map((option, index) => <MenuItem key={index} { ...option } />)}
                </IconMenu>
            </AltContainer>
        );
    }
}

const sortOptions = [
    {
        caption: 'Random',
        value: 'random'
    },
    {
        caption: 'Performance',
        value: 'stat_type_95 desc'
    },
    {
        caption: 'Date Published',
        value: 'creation_date desc'
    },
    {
        caption: 'Date Added',
        value: 'ucid desc'
    },
    {
        caption: 'Relevance',
        value: '_score desc'
    },
    {
        caption: 'Site',
        value: 'site_id desc'
    },
    {
        caption: 'Title',
        value: 'title asc'
    }
];
