import React, { Component, PropTypes } from 'react';
import { List } from 'react-toolbox';
import { flatten, pick } from 'lodash';

import Influencer from './Influencer.component';

/**
 * Keeps track of which platforms are selected
 * Indicates which platforms to schedule the current story on
 */
export default class MultiInfluencerSelector extends Component {

    /**
     * Create a multi-influencer selector component
     * @param {Object} props are defined at the bottom
     * @return {MultiInfluencerSelector}
     */
    constructor(props) {
        super(props);
        this.onInfluencerChange = this.onInfluencerChange.bind(this);
        this.componentDidUpdate = this.cacheCallbackMethods;

        this.state = {
            influencers: this.props.influencers,
            selected: this.getSelectedPlatforms() // should contain only selected platforms
        };
    }

    /**
     * Let parent element know how many are currently selected
     * because most of the time at least one will be initially selected
     */
    componentDidMount() {
        this.cacheCallbackMethods();
        this.onChange(this.state.selected);
    }

    /**
     * Display a list of influencers and their connected platforms
     */
    render() {
        return (
            <List>
                {this.props.influencers.map(influencer => <Influencer key={influencer.name} {...influencer} onChange={this.onInfluencerChange} />)}
            </List>
        );
    }

    /**
     * Cache callback methods
     */
    cacheCallbackMethods() {
        this.onChange = this.props.onChange;
    }

    /**
     * Update state of selected platforms
     * Update parent element
     * @param {Object} influencer that was recently updated
     */
    onInfluencerChange(influencer) {
        let updatedInfluencers = this.state.influencers.filter(i => i.id !== influencer.id);
        updatedInfluencers = [
            ...updatedInfluencers,
            influencer
        ];


        const selectedPlatforms = flatten(updatedInfluencers.map(influencer => influencer.platforms))
                                  .filter(platform => platform.selected);

        const newState = {
            selected: selectedPlatforms,
            influencers: updatedInfluencers
        };

        this.setState(newState);
        this.onChange && this.onChange(newState.selected);
    }

    /**
     * Iterate over given platforms and identify which ones are selected
     * Only called once at initial
     * @return {Array} selected platforms
     */
    getSelectedPlatforms() {
        const allPlatforms = flatten(this.props.influencers.map(influencer => influencer.platforms));
        return allPlatforms.filter(platform => platform.selected);
    }
}

MultiInfluencerSelector.defaultProps = {
    influencers: []
};
