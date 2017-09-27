import React from 'react';
import AltContainer from 'alt-container';

import UserStore from '../../stores/User.store'
import Store from '../../stores/Filter.store';

import Actions from '../../actions/Filter.action';
import UserActions from '../../actions/User.action'

import Component from './InfluencerSelector.component';

/**
 * Container for Influencer Selector
 * links the component with the filter store and dispatches
 * actions from the component when an influencer is selected
 * @return {React.Component}
 */
export default class InfluencerSelector extends React.Component {

    /**
     * Render container component
     * @return {React.Component}
     */
    render() {
        return (
            <AltContainer
                component={Component}
                store={Store}
                actions={{
                    ...Actions,
                    selectInfluencer: UserActions.changeSelectedInfluencer
                }}
                transform={props => ({
                    ...props,
                    ...this.props,
                    selectedInfluencer: UserStore.getState().selectedInfluencer
                })}
            />
        );
    }
}
