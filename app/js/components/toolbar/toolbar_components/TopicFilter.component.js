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
                actions={{
                    onChange: ::this.changeTopic
                }}
                stores={{
                    value: props => ({
                        store: FilterStore,
                        value: _.find(topics, { filters: _.pick(FilterStore.getState(), 'trending', 'relevant') }).value // find out which topics matches the filters in the Store
                    })
                }}
                inject={{
                    auto: true,
                    label: 'Explore',
                    source: topics,
                }}
            />
        );
    }

    changeTopic(value) {
        var selectedFilter = _.find(topics, { value: value });
        FilterActions.update(selectedFilter.filters);
        this.props.onChange && this.props.onChange();
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
