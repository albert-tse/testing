import React from 'react';
import AltContainer from 'alt-container';
import Store from '../../stores/Filter.store';
import Actions from '../../actions/Filter.action';

import Component from './InfluencerSelector.component';

/**
 * Container for Influencer Selector
 * links the component with the filter store and dispatches
 * actions from the component when an influencer is selected
 * @return {React.Component}
 */
export default class InfluencerSelector extends React.Component {

    /**
     * Instantiate with props passed from parent component
     * @return {InfluencerSelector}
     */
    constructor(props) {
        super(props);
    }

    /**
     * Render container component
     * @return {React.Component}
     */
    render() {
        return (
            <AltContainer
                component={Component}
                store={Store}
                actions={Actions}
                transform={props => ({
                    ...props,
                    ...this.props
                })}
            />
        );
    }
}
