import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import AltContainer from 'alt-container';
import { Dropdown } from 'react-toolbox';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import SearchActions from '../../../actions/Search.action';
import _ from 'lodash';

export default class TopicFilter extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    render() {
        return (
            <AltContainer
                component={Dropdown}
                store={FilterStore}
                shouldComponentUpdate={::this.shouldUpdate}
                transform={ props => ({
                    auto: true,
                    label: 'Explore',
                    source: topics,
                    onChange: ::this.changeTopic,
                    value: this.getValue(props)  // find out which topics matches the filters in the Store
                })}
            />
        );
    }

    changeTopic(value) {
        var selectedFilter = _.find(topics, { value: value });
        FilterActions.update(selectedFilter.filters);
        this.props.onChange && this.props.onChange();
    }

    shouldUpdate(prevProps, container, nextProps) {
        var prev = prevProps.value;
        var next = this.getValue(nextProps);
        var propertiesChanged = ! _.isEqual(prev, next);
        return propertiesChanged;
    }

    getValue(filters) {
        return _.find(topics, { filters: _.pick(filters, 'trending', 'relevant') }).value;
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
