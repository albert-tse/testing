import React, { Component } from 'react';
import AltContainer from 'alt-container';
import moment from 'moment';
import { Toolbars } from '../toolbar';
import QuerySource from '../../sources/Query.source';
import InfluencerSource from '../../sources/Influencer.source';
import UserStore from '../../stores/User.store'
import FilterStore from '../../stores/Filter.store'
import AppActions from '../../actions/App.action'
import { AppContent } from '../shared';
import Cards from './cards.component';
import Graph from './graph.component';
import Table from './table.component';
import { content } from './styles';

const runQuery = QuerySource.runQuery().remote;
const getProjectedRevenue = InfluencerSource.projectedRevenue().remote;

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                store={FilterStore}
                component={DashboardComponent}
            />
        );
    }
}

class DashboardComponent extends React.Component {

    constructor(props) {
        super(props);

        this.updateAggregateStats = this.updateAggregateStats.bind(this);
        this.updateProjectedRevenue = this.updateProjectedRevenue.bind(this);
        this.state = {
            cardData: {
                estimatedRevenue: false,
                totalPosts: false,
                averageRevenuePerPost: false,
                totalClicks: false,
                averageClicksPerPost: false,
                averageCtrPerPost: false,
                averageReachPerPost: false,
                postsPerDay: false,
                clicksPerDay: false,
                reachPerDay: false,
                projectedRevenue: false,
                userRole: UserStore.getState().user.role
            },

            graphData: []
        }
    }

    componentWillMount() {
        this.updateAggregateStats();
    }

    componentWillReceiveProps() {
        this.updateAggregateStats();
    }

    render() {
        return (
            <div className={content}>
                <Toolbars.Analytics />
                <AppContent id="analytics">
                    <Cards {...this.state.cardData} projectedRevenue={this.state.projectedRevenue}/>
                    <Graph clicks={this.state.graphData} />
                    <Table />
                </AppContent>
            </div>
        );
    }

    updateAggregateStats() {
        const filters = this.props;

        _.defer(AppActions.loading);

        this.setState({
            cardData: {
                estimatedRevenue: false,
                totalPosts: false,
                averageRevenuePerPost: false,
                totalClicks: false,
                averageClicksPerPost: false,
                averageCtrPerPost: false,
                averageReachPerPost: false,
                postsPerDay: false,
                clicksPerDay: false,
                reachPerDay: false,
                userRole: UserStore.getState().user.role
            },

            graphData: []
        });

        let poDOTstData = 0;
        let totalsData = 0;
        let poDOTstClicksQuery = {
          "table": "links",
          "fields": [
            { "name": "saved_date", "date": true, "alias": "saved_date" },
            { "name": "cpc_influencer" },
            {
              "name": "post_clicks",
              "sum": true,
              "alias": "post_clicks"
            },
            { "name": "fb_posts.clicks" }
          ],
          "rules": {
            "combinator": "and",
            "rules": [
              {
                "field": "fb_posts.clicks",
                "operator": "null",
                "value": "null"
              }
            ]
          },
          "group": [{"name":"links.saved_date", "date": true}, "cpc_influencer"],
          "offset": "0"
        };

        poDOTstClicksQuery = appendQueryFilters(poDOTstClicksQuery);

        var totalsQuery = {
          "table": "links",
          "fields": [
            {
              "name": "saved_date",
              "date": true,
              "alias": "saved_date"
            },
            {
              "name": "cpc_influencer"
            },
            {
              "name": "id",
              "count_distinct": true,
              "alias": "num_links"
            },
            {
              "name": "fb_posts.clicks",
              "sum": true,
              "alias": "fb_clicks"
            },
            {
              "name": "fb_posts.reach",
              "sum": true,
              "alias": "fb_reach"
            }
          ],
          "rules": {
            "combinator": "and",
            "rules": [
            ]
          },
          "group": [{"name":"links.saved_date", "date": true}, "cpc_influencer"],
          "offset": "0"
        };

        totalsQuery = appendQueryFilters(totalsQuery);


        const getTotals = function(){
            return runQuery({}, totalsQuery).then(function(data){
                totalsData = data.data.data;
            });
        }

        const getPoDotStClicks = function(){
            return runQuery({}, poDOTstClicksQuery).then(function(data){
                poDOTstData = data.data.data;
            });
        }

        if(this.revenuePromise){
            this.revenuePromise.cancel();
        }

        this.revenuePromise = this.updateProjectedRevenue()

        if(this.totalsPromise){
            this.totalsPromise.cancel();
        }

        this.totalsPromise = Promise.all([
            getTotals(),
            getPoDotStClicks()
        ]).then(() => {
            var totalReach = 0;
            var totalReachClicks = 0;
            var cardData = {
                estimatedRevenue: 0,
                totalPosts: 0,
                averageRevenuePerPost: 0,
                totalClicks: 0,
                averageClicksPerPost: 0,
                averageCtrPerPost: 0,
                averageReachPerPost: 0,
                postsPerDay: 0,
                clicksPerDay: 0,
                reachPerDay: 0,
                userRole: UserStore.getState().user.role
            };
            var graphData = {};

            _.each(totalsData, function(el){
                cardData.totalPosts += el.num_links;
                cardData.estimatedRevenue += el.fb_clicks * el.cpc_influencer;
                cardData.totalClicks += el.fb_clicks;
                totalReach += el.fb_reach;
                totalReachClicks += el.fb_clicks;

                if(el.fb_clicks){
                    if(!graphData[el.saved_date]){
                        graphData[el.saved_date] = 0;
                    }
                    graphData[el.saved_date] += el.fb_clicks;
                }
            });

            _.each(poDOTstData, function(el){
                cardData.estimatedRevenue += el.post_clicks * el.cpc_influencer;
                cardData.totalClicks += el.post_clicks;
                if(el.post_clicks){
                    if(!graphData[el.saved_date]){
                        graphData[el.saved_date] = 0;
                    }
                    graphData[el.saved_date] += el.post_clicks;
                }
            });

            graphData = _.map(graphData, function(el,i){
                return {
                    clicks: el,
                    date: moment(i).toDate()
                };
            });

            cardData.averageRevenuePerPost = cardData.estimatedRevenue / cardData.totalPosts;
            cardData.averageClicksPerPost = cardData.totalClicks / cardData.totalPosts;
            cardData.averageReachPerPost = totalReach / cardData.totalPosts;

            var num_days = moment(filters.analyticsDateRange.date_end).diff(moment(filters.analyticsDateRange.date_start), 'days');

            cardData.postsPerDay = cardData.totalPosts / num_days;
            cardData.clicksPerDay = cardData.totalClicks / num_days;
            cardData.reachPerDay = totalReach / num_days;

            cardData.averageCtrPerPost = ((totalReachClicks / totalReach) * 100) / cardData.totalPosts;

            _.each(cardData, function(el,i){
                if(isNaN(el) && i != 'userRole'){
                    cardData[i] = false;
                }
            });

            this.setState({
                cardData: cardData,
                graphData: graphData
            });
            _.defer(AppActions.loaded);
        })
        .finally(function(){
            _.defer(AppActions.loaded);
        });
    }

    updateProjectedRevenue() {
        const selectedInfluencers = this.props.influencers.filter(inf => inf.enabled).map(inf => inf.id);
        const allInfluencers = this.props.influencers.map(inf => inf.id);
        const influencers = selectedInfluencers.length > 0 ? selectedInfluencers : allInfluencers;

        return getProjectedRevenue({}, influencers.join(',')).then(data => {
            this.setState({
                projectedRevenue: data.data.data.projectedRevenue
            });
        });
    }
}


function appendQueryFilters(query) {
    var filters = FilterStore.getState();
    if(filters.date_start){
        query.rules.rules.push({
            "field": "saved_date",
            "operator": ">=",
            "value": filters.analyticsDateRange.date_start
        });
    }

    if(filters.date_end){
        query.rules.rules.push({
            "field": "saved_date",
            "operator": "<=",
            "value": filters.analyticsDateRange.date_end
        });
    }

    var influencers = _.chain(filters.influencers).filter({enabled: true}).map('id').value();
    if(influencers.length == 0){
        influencers = _.chain(filters.influencers).map('id').value();
    }

    query.rules.rules.push({
        "field": "partner_id",
        "operator": "in",
        "value": influencers
    });

    if(filters.platforms && _.filter(filters.platforms, {enabled: true}).length > 0){
        query.rules.rules.push({
            "field": "platform_id",
            "operator": "in",
            "value": _.chain(filters.platforms).filter({enabled: true}).map('id')
        });
    }

    if(filters.used_sites && _.filter(filters.used_sites, {enabled: true}).length > 0){
        query.rules.rules.push({
            "field": "site_id",
            "operator": "in",
            "value": _.chain(filters.used_sites).filter({enabled: true}).map('id')
        });
    }
    return query;
}
