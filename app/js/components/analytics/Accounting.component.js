import React, { Component } from 'react';
import AltContainer from 'alt-container';

import AccountingTable from './AccountingTable.component';
import Widget from './Widget.component';
import { AppContent } from '../shared';
import { Toolbars } from '../toolbar';

import { content, heading } from './styles';
import { linksTable, cpcTable, cpcSection } from './table.style';
import { center, fullWidth, widgetContainer } from './cards.style';

import UserStore from '../../stores/User.store';
import FilterStore from '../../stores/Filter.store';
import InfluencerSource from '../../sources/Influencer.source';
import AppActions from '../../actions/App.action';

import moment from 'moment';
import numeral from 'numeral';
import _ from 'lodash';
import classnames from 'classnames';

export default class Accounting extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={AccountingComponent}
                store={FilterStore}
            />
        );
    }
}

class AccountingComponent extends Component {

    constructor(props) {
        super(props);
        this.showReport = this.showReport.bind(this);
        this.showProjectedRevenue = this.showProjectedRevenue.bind(this);
        this.showCpcs = this.showCpcs.bind(this);
        this.state = {
            data: {},
            influencerBaseCpc: 0,
            influencerSiteCpcs: []
        };
    }

    componentWillMount() {
        this.getInfluencerPayout(this.props);
    }

    // This gets called when filters change
    // We will dispatch a request from here if appropriate filters have been changed
    componentWillReceiveProps(nextProps) {
        if (this.influencerDidChange(this.props, nextProps) || this.selectedMonthDidChange(this.props, nextProps)) {
            this.getInfluencerPayout(nextProps);
        }
    }

    // Decides if we should render the component or not
    shouldComponentUpdate(nextProps, nextState) {
        return this.influencerDidChange(this.props, nextProps)
            || this.props.selectedAccountingMonth !== nextProps.selectedAccountingMonth
            || this.state !== nextState;
    }

    render() {
        return (
            <div className={content}>
                <Toolbars.Accounting />
                <AppContent id="accounting">
                    { Object.keys(this.state.data).length > 0 ? this.results() : 'Not Available' }
                </AppContent>
            </div>
        );
    }

    results() {
        const { links, revenue, totalLinks } = this.state.data;

        let influencerCpcList = false;

        const user = UserStore.getState().user;

        if ((_(user.permissions).includes('view_cpc_overrides') || user.role === 'admin') && this.state.influencerSiteCpcs.length > 0) {
            influencerCpcList = (
                <div className={cpcSection}>
                    <h3>My CPCs</h3>
                    <table className={classnames(linksTable, cpcTable)}>
                        <thead>
                            <tr>
                                <th>Site</th>
                                <th>CPC</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td><b>Base CPC</b></td>
                            <td><b>${this.state.influencerBaseCpc}</b></td>
                        </tr>
                        { this.state.influencerSiteCpcs.map((cpc, index) => (
                            <tr key={index}>
                                <td>{cpc.site_name}</td>
                                <td>${cpc.cpc}</td>
                            </tr>
                        )) }
                        </tbody>
                    </table>
                </div>
                )
        }

        return (
            <div>
                <section className={classnames(widgetContainer, center)}>
                    <Widget label="Estimated Revenue" value={revenue} caption={this.state.projectedRevenue} />
                    <Widget label="Total Links" value={totalLinks} />
                </section>
                <section className={classnames(widgetContainer, fullWidth)}>
                    <Widget 
                        label=""
                        value={links.length > 0 ? <AccountingTable links={links} /> : <span>No links to show</span>}
                    />
                </section>
                <section className={classnames(widgetContainer, center)}>
                   {influencerCpcList}
                </section>
            </div>
        );
    }

    getInfluencerPayout(filterState) {
        _.defer(AppActions.loading);
        const selectedInfluencer = UserStore.getState().selectedInfluencer.id; // filterState.influencers.filter(inf => inf.enabled).map(inf => inf.id).join();
        const monthlyPayout = InfluencerSource.getMonthlyPayout();
        const projectedRevenue = InfluencerSource.projectedRevenue();
        const influencerSiteCpcs = InfluencerSource.getCpcs();
        
        // if Filters.monthOffset === 0 then getProjectedRevenue
        if (filterState.selectedAccountingMonth === 0) {
            projectedRevenue.remote({}, selectedInfluencer)
                .then(this.showProjectedRevenue)
                .catch(error => console.error('Error: Could not fetch the projected revenue', error))
                .finally(() => _.defer(AppActions.loaded));
        } else {
            this.setState({ projectedRevenue: null });
        }

        monthlyPayout.remote({}, selectedInfluencer, filterState.selectedAccountingMonth)
            .then(this.showReport)
            .catch(error => {
                console.log(error);
                console.error("Error: Could not get the current month's report")
            })
            .finally(() => _.defer(AppActions.loaded));

        influencerSiteCpcs.remote({}, selectedInfluencer)
            .then(this.showCpcs)
            .catch(error => console.log(error))
            .finally(() => _.defer(AppActions.loaded));
    }

    showCpcs({data: { data }}) {
        return new Promise((success, reject) => {
            let updatedState = {
                influencerSiteCpcs: data.sites,
                influencerBaseCpc: data.base
            }

            this.setState(updatedState, success);
        });
    }

    showProjectedRevenue({data: { data }}) {
        return new Promise( (success, reject) => {
            const updatedState = { projectedRevenue: ` projected ${numeral(data.projectedRevenue).format('$0,0.00')}` };
            this.setState(updatedState, success);
        });
    }

    showReport({ data: { data } }) {
        return new Promise( (success, reject) => {
            const filters = FilterStore.getState();
            const influencers = _.keyBy(filters.influencers, 'id');
            const platforms = _.keyBy(filters.platforms, 'id');

            data.revenue = data.estimatedRevenue ? numeral(data.estimatedRevenue).format('$0,0.00') : 0;
            data.totalLinks = Array.isArray(data.links) && data.links.length > 999 ? numeral(data.links.length).format('0.00a') : (data.links.length || 0);
            data.links = data.links.map(link => ({
                ...link,
                credited_clicks: numeral(link.credited_clicks || 0).format('0.00a'),
                ctr: link.ctr === null ? '0' : numeral(link.ctr).format('0.00a'),
                reach: link.fb_reach && numeral(link.fb_reach).format('0.00a') || 0,
                revenue: numeral(link.cost).format('$0,0.00'),
                fromNow: link.shared_date !== null ? moment(link.shared_date).format('MMMM D, YYYY') : 'Not shared',
                influencer_name: data.influencer.name,
                platform_name: link.platform_id in platforms ? platforms[link.platform_id].name : 'Unknown Platform',
                shortened_link: 'https://qklnk.co/' + link.hash
            })).sort( (a, b) => b.cost - a.cost ).slice(0,10);

            this.setState({ data }, success);
        });
    }

    influencerDidChange(previous, next) {
        return previous.influencers !== next.influencers;
    }

    selectedMonthDidChange(previous, next) {
        return previous.selectedAccountingMonth !== next.selectedAccountingMonth;
    }
}
