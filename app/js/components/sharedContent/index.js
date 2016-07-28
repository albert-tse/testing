import React from 'react';
import AltContainer from 'alt-container';
import InfluencerStore from '../../stores/Influencer.store'
import InfluencerActions from '../../actions/Influencer.action'
import { Toolbars } from '../toolbar';
import { AppContent } from '../shared';
import Widgets from './dashboard/Widgets.component';
import Chart from './dashboard/Chart.component';

class SharedContent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InfluencerActions.searchClicks();
        InfluencerActions.searchLinks();
    }

    componentWillUnmount() {
        InfluencerStore.unlisten(::this.onDataChange);
    }

    render() {
        return (
            <div>
                <Toolbars.Shared />
                <AppContent id="sharedlinks">
                    <Widgets />
                    <Chart />
                </AppContent>
            </div>
        );
    }
}

export default SharedContent
