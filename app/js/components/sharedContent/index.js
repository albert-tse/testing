import React from 'react';
import AltContainer from 'alt-container';
import InfluencerStore from '../../stores/Influencer.store'
import UserStore from '../../stores/User.store'
import InfluencerActions from '../../actions/Influencer.action'
import { Toolbars } from '../toolbar';
import { AppContent } from '../shared';
import Widgets from './dashboard/Widgets.component';
import Chart from './dashboard/Chart.component';
import LinksTable from './dashboard/LinksTable.component';
import { main, side, dashboardPanel } from './style';

export default class SharedContent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        InfluencerActions.searchClicks();
        InfluencerActions.searchLinks();
        InfluencerActions.getProjectedRevenue();
        UserStore.listen(::this.onInfluencerChange);
    }

    componentWillUnmount() {
        UserStore.unlisten(::this.onInfluencerChange);
    }

    onInfluencerChange() {
        setTimeout(function () {
            InfluencerActions.searchClicks();
            InfluencerActions.searchLinks();
            InfluencerActions.getProjectedRevenue();
        }, 1);
    }

    render() {
        return (
            <div>
                <Toolbars.Shared />
                <AppContent id="sharedlinks" className={dashboardPanel}>
                    <div className={dashboardPanel}>
                        <Widgets />
                        <Chart />
                        <LinksTable />
                    </div>
                </AppContent>
            </div>
        );
    }
}
