import React, { Component } from 'react';
import AltContainer from 'alt-container';

import AccountingTable from './AccountingTable.component';
import Widget from './Widget.component';
import { AppContent } from '../shared';
import { Toolbars } from '../toolbar';

import { content } from './styles';
import { widgetContainer } from './cards.style';

import FilterStore from '../../stores/Filter.store';
import InfluencerSource from '../../sources/Influencer.source';
import AppActions from '../../actions/App.action';

import moment from 'moment';
import numeral from 'numeral';
import { defer, keyBy } from 'lodash';

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
        this.state = {
            data: {}
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
                <AppContent>
                    { Object.keys(this.state.data).length > 0 ? this.results() : 'Not Available' }
                </AppContent>
            </div>
        );
    }

    results() {
        const { links, revenue, totalLinks } = this.state.data;

        return (
            <div>
                <section className={widgetContainer}>
                    <Widget label="Estimated Revenue" value={revenue} />
                    <Widget label="Total Links" value={totalLinks} />
                </section>
                <section className={widgetContainer}>
                    <Widget 
                        label="My Top Earning Links"
                        value={<AccountingTable links={links} />}
                    />
                </section>
            </div>
        );
    }

    getInfluencerPayout(filterState) {
        defer(AppActions.loading);
        const selectedInfluencers = filterState.influencers.filter(inf => inf.enabled).map(inf => inf.id).join();
        const { remote, success, error } = InfluencerSource.getMonthlyPayout();
        
        // if Filters.monthOffset === 0 then getProjectedRevenue
        if (true) {
        }

        remote({}, selectedInfluencers, filterState.selectedAccountingMonth).then(({ data: { data } }) => {
            success();

            const filters = FilterStore.getState();
            const influencers = keyBy(filters.influencers, 'id');
            const platforms = keyBy(filters.platforms, 'id');

            data.revenue = data.estimatedRevenue ? numeral(data.estimatedRevenue).format('$0,0.00') : 0;
            data.totalLinks = Array.isArray(data.links) && data.links.length > 999 ? numeral(data.links.length).format('0.00a') : (data.links.length || 0);
            data.links = data.links.map(link => ({
                ...link,
                credited_clicks: numeral(link.credited_clicks || 0).format('0.00a'),
                ctr: link.ctr === null ? '0%' : numeral(link.ctr).format('0%'),
                reach: link.fb_reach && numeral(link.fb_reach).format('0.00a') || 0,
                revenue: numeral(link.cost).format('$0,0.00'),
                fromNow: link.shared_date !== null ? moment(link.shared_date).format('MMMM D, YYYY') : 'Not shared',
                influencer_name: data.influencer.name,
                platform_name: link.platform_id in platforms ? platforms[link.platform_id].name : 'Unknown Platform',
                shortened_link: 'https://qklnk.co/' + link.hash
            })).sort( (a, b) => b.cost - a.cost ).slice(0,10);

            this.setState({ data });
        }).catch(error);
    }

    influencerDidChange(previous, next) {
        return previous.influencers !== next.influencers;
    }

    selectedMonthDidChange(previous, next) {
        return previous.selectedAccountingMonth !== next.selectedAccountingMonth;
    }
}
