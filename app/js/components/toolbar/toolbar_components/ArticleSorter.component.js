import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import AltContainer from 'alt-container';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox';
import Styles from '../styles';

export default class ArticleSorter extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        var filters = FilterStore.getState();
        var sortValue = filters.sort.indexOf('_rand_') != -1 ? 'random' : filters.sort;

        return (
            <IconMenu
                icon="sort"
                className={Styles.defaultColor}
                selectable
                selected={ sortValue }
                onSelect={::this.updateValue}>
                { sortOptions.map( (option, index) => (<MenuItem key={index} { ...option } />) ) }
            </IconMenu>
        );
    }

    updateValue(newValue) {
        newValue = newValue === 'random' ? '_rand_' + parseInt(1e4 * Math.random()) + ' desc' : newValue;
        FilterActions.update({ sort: newValue });
        this.props.onSelect && this.props.onSelect();
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
