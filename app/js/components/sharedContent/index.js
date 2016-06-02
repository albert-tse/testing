import React from 'react';
import AltContainer from 'alt-container';
import Component from './SharedContent.component';
import InfluencerStore from '../../stores/Influencer.store'
import InfluencerActions from '../../actions/Influencer.action'
import FilterStore from '../../stores/Filter.store'
import FilterActions from '../../actions/Filter.action'
import { AppContent } from '../shared';
import { FilterToolbar } from '../toolbar';

class SharedContent extends React.Component {

    constructor(props) {
        super(props);

        //TODO Move filter and sort into this comp
        //TODO Add calls to get data here
        //TODO listen to filter changes, and refresh accordingly
        //TODO Loading thingy
    }

    componentDidMount() {
        InfluencerActions.searchClicks();
    }

    render() {
        return (
            <div>
                <FilterToolbar title="Shared Links" />
                <AppContent id="sharedlinks">
                    <AltContainer
                        stores={{
                            data: props => ({
                                store: InfluencerStore,
                                value: InfluencerStore.getState().searchedClickTotals
                            }),

                            filters: props => ({
                                store: InfluencerStore,
                                value: InfluencerStore.getState().searchedClickTotals
                            })
                        }}
                        component={ Component }
                    />
                </AppContent>
            </div>
        );
    }
}

export default SharedContent
