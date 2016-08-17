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

import numeral from 'numeral';

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
        if (this.influencerDidChange(this.props, nextProps)) {
            this.getInfluencerPayout(nextProps);
        }
    }

    // Decides if we should render the component or not
    shouldComponentUpdate(nextProps, nextState) {
        return this.influencerDidChange(this.props, nextProps)
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
        console.log('I rendered', this.state.data);

        const { estimatedRevenue, links } = this.state.data;
        const revenue = estimatedRevenue ? numeral(estimatedRevenue).format('$0,0.00') : 0;
        const totalLinks = Array.isArray(links) && links.length > 999 ? numeral(links.length).format('0.00a') : (links.length || 0);

        return (
            <div>
                <section className={widgetContainer}>
                    <Widget label="Estimated Revenue" value={revenue} />
                    <Widget label="Total Links" value={totalLinks} />
                </section>
                <AccountingTable />
            </div>
        );
    }

    getInfluencerPayout(filterState) {
        AppActions.loading();
        const selectedInfluencers = filterState.influencers.filter(inf => inf.enabled).map(inf => inf.id).join();
        const { remote, success, error } = InfluencerSource.getMonthlyPayout();
        
        // if Filters.monthOffset === 0 then getProjectedRevenue
        if (true) {
        }

        // getInfluencerPayout(influencerId, monthOffset)
        remote({}, selectedInfluencers, 0).then(({ data: { data } }) => {
            success();
            this.setState({ data });
        }).catch(error);
    }

    influencerDidChange(previous, next) {
        return previous.influencers !== next.influencers;
    }
}
