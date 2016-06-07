import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import AltContainer from 'alt-container';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import SearchStore from '../../../stores/Search.store';
import SearchActions from '../../../actions/Search.action';
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox';
import Styles from '../styles';

export default class ArticleSorter extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        var actions = props => ({
            onSelect: newValue => {
                this.setState({ sort: newValue });
                newValue = newValue === 'random' ? '_rand_' + parseInt(1e4 * Math.random()) + ' desc' : newValue;
                FilterActions.update({ sort: newValue });
                _.delay(SearchActions.getResults, 1000);
            }
        });

        var filters = FilterStore.getState();
        var sortValue = filters.sort.indexOf('_rand_') != -1 ? 'random' : filters.sort;

        return (
            <AltContainer
                actions={ actions }>
                <IconMenu icon="sort" className={Styles.defaultColor} selectable selected={ sortValue }>
                    {
                        _.map(sortOptions, function(option, index){
                            return <MenuItem key={index} { ...option } />
                        })
                    }
                </IconMenu>
            </AltContainer>
        );
    }
}

const sortOptions = [{
    caption: 'Random',
    value: 'random'
}, {
    caption: 'Performance',
    value: 'stat_type_95 desc'
}, {
    caption: 'Date Published',
    value: 'creation_date desc'
}, {
    caption: 'Date Added',
    value: 'ucid desc'
}, {
    caption: 'Relevance',
    value: '_score desc'
}, {
    caption: 'Site',
    value: 'site_id desc'
}, {
    caption: 'Title',
    value: 'title asc'
}];
