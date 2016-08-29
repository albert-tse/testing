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
        this.changeSort = this.changeSort.bind(this);
    }

    render() {
        return (
            <div title="Sort By">
                <AltContainer
                    component={Dropdown}
                    store={FilterStore}
                    shouldComponentUpdate={ (prevProps, container, nextProps) => prevProps.sort !== nextProps.sort }
                    transform={ ({sort}) => ({
                        auto: true,
                        label: 'Sort by',
                        source: sortOptions,
                        onChange: this.changeSort,
                        value: /rand/i.test(sort) ? 'random' : sort
                    })}
                />
            </div>
        );
    }

    changeSort(sort) {
        sort = sort === 'random' ? '_rand_' + parseInt(1e4 * Math.random()) + ' desc' : sort;
        FilterActions.update({sort});
        this.props.onSelect && this.props.onSelect();
    }
}

const sortOptions = [{
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

ArticleSorter.propTypes = {
    onSelect: React.PropTypes.func
};
