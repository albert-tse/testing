import React, { Component } from 'react';
import AltContainer from 'alt-container';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox';
import Styles from '../styles';

export default class ArticleSorter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={IconMenu}
                store={ FilterStore }
                shouldComponentUpdate={ (prevProps, container, nextProps) => prevProps.sort !== nextProps.sort }
                transform={ (props) => ({
                    icon: 'sort',
                    className: Styles.defaultColor,
                    selectable: true,
                    selected: props.sort.indexOf('_rand_') != -1 ? 'random' : props.sort,
                    onSelect: ::this.updateValue,
                    children: sortOptions.map( (option, index) => (<MenuItem key={index} { ...option } />) )
                })}
            />
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
