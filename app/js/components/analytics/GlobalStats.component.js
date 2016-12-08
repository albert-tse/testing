import React, { Component } from 'react';
import AltContainer from 'alt-container';

import AccountingTable from './AccountingTable.component';
import Graph from './graph.component';
import Widget from './Widget.component';
import { AppContent } from '../shared';
import { Toolbars } from '../toolbar';

import { content, heading, loading } from './styles';
import { linksTable, cpcTable, cpcSection } from './table.style';
import { center, fullWidth, widgetContainer } from './cards.style';

import FilterStore from '../../stores/Filter.store';
import InfluencerSource from '../../sources/Influencer.source';
import AppActions from '../../actions/App.action';

import moment from 'moment';
import numeral from 'numeral';
import _ from 'lodash';
import classnames from 'classnames';
import { isMobilePhone } from '../../utils';

export default class GlobalStats extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={GlobalStatsComponent}
                store={FilterStore}
            />
        );
    }
}

class GlobalStatsComponent extends Component {

    constructor(props) {
        super(props);

        this.updateGraph = this.updateGraph.bind(this);
        this.state = {
            graphData: [],
            monthlyClicks: 0,
            influencerPayout: 0,
            pubMonthlyClicks: 0,
            pubCost: 0
        };
    }

    componentDidMount() { }

    componentWillMount() {
        this.loadPageData(this.props);
    }

    // This gets called when filters change
    // We will dispatch a request from here if appropriate filters have been changed
    componentWillReceiveProps(nextProps) {
        if (this.selectedMonthDidChange(this.props, nextProps)) {
            this.loadPageData(nextProps);
        }
    }

    // Decides if we should render the component or not
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.selectedAccountingMonth !== nextProps.selectedAccountingMonth
            || this.state !== nextState;
    }

    render() {
        return (
            <div className={content}>
                <Toolbars.Accounting />
                <AppContent id="accounting">
                    { Object.keys(this.state.graphData).length > 0 ? this.results() : <h2 className={loading}>Loading...</h2> }
                </AppContent>
            </div>
        );
    }

    results() {
        let totalClicks = this.state.monthlyClicks;
        let totalPayout = this.state.influencerPayout;

        let pubMonthlyClicks = this.state.pubMonthlyClicks;
        let pubCost = this.state.pubCost;

        totalClicks = numeral(totalClicks).format('0.00a');
        totalPayout = numeral(totalPayout).format('$0,0.00');

        pubMonthlyClicks = numeral(pubMonthlyClicks).format('0.00a');
        pubCost = numeral(pubCost).format('$0,0.00');

        return (
            <div>
                <section className={classnames(widgetContainer)}>
                    <Widget label="Total Influencer Clicks" value={totalClicks} />
                    <Widget label="Total Influencer Payout" value={totalPayout} />
                    <Widget label="Total Publisher Clicks" value={pubMonthlyClicks} />
                    <Widget label="Total Publisher Billing" value={pubCost} />
                </section>
                {!isMobilePhone() &&
                <section className={classnames(widgetContainer, fullWidth)}>
                    <Graph clicks={this.state.graphData} />
                </section>
                }
            </div>
        );
    }

    loadPageData(filterState) {
        _.defer(AppActions.loading);
        
        const dailyClicks = InfluencerSource.getGlobalDailyClicks();

        dailyClicks.remote({}, filterState.selectedAccountingMonth)
            .then(this.updateGraph)
            .catch(error => {
                console.log(error);
                console.error("Error: Could not get the graph data")
            })
            .finally(() => _.defer(AppActions.loaded));
        
    }

     updateGraph({data: { data }}) {
        return new Promise((success, reject) => {
            
            var graphData = _.map(data.clicksPerDay, function(el,i){
                return {
                    clicks: el.clicks,
                    date: moment(el.date).toDate()
                };
            });

            let updatedState = {
                graphData: graphData,
                monthlyClicks: data.clicksPerMonth,
                influencerPayout: data.influencerPaymentPerMonth,
                pubMonthlyClicks: data.pubClicksPerMonth,
                pubCost: data.pubBilledPerMonth
            }

            this.setState(updatedState, success);
        });
    }

    selectedMonthDidChange(previous, next) {
        return previous.selectedAccountingMonth !== next.selectedAccountingMonth;
    }
}
