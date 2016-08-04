import React, { Component } from 'react';
import AltContainer from 'alt-container';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import { Dropdown } from 'react-toolbox';
import Styles from '../styles';
import find from 'lodash/find';

export default class ArticleSorter extends Component {
    constructor(props) {
        super(props);
        this.updateValue = this.updateValue.bind(this);
        this.getValue = this.getValue.bind(this);
    }

    render() {
        return (
            <AltContainer
                component={Dropdown}
                store={FilterStore}
                shouldComponentUpdate={ (prevProps, container, nextProps) => prevProps.sort !== nextProps.sort }
                transform={props => ({
                    auto: true,
                    label: 'Sort by',
                    source: options,
                    onChange: this.updateValue,
                    value: props.sort
                })}
            />
        );
    }

    updateValue(newValue) {
        newValue = newValue === 'random' ? '_rand_' + parseInt(1e4 * Math.random()) + ' desc' : newValue;
        FilterActions.update({ sort: newValue });
    }
}

const options = [{
    label: 'Random',
    value: 'random'
}, {
    label: 'Performance',
    value: 'stat_type_95 desc'
}, {
    label: 'Date Published',
    value: 'creation_date desc'
}, {
    label: 'Date Added',
    value: 'ucid desc'
}, {
    label: 'Relevance',
    value: '_score desc'
}, {
    label: 'Site',
    value: 'site_id desc'
}, {
    label: 'Title',
    value: 'title asc'
}];
