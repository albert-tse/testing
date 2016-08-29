import React from 'react';
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
                userRole: UserStore.getState().user.role
            },

            graphData: []
        }
    }

    componentDidMount() {
        _.defer(::this.onFilterChange);
        this.onFilterChangeBoundReference = ::this.onFilterChange;
        FilterStore.listen(this.onFilterChangeBoundReference);
    }

    componentWillUnmount() {
        FilterStore.unlisten(this.onFilterChangeBoundReference);
    }

    onFilterChange(){
        updateAggregateStats(this);
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
}

function updateAggregateStats(component){
    _.defer(AppActions.loading);

    component.setState({
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
    var poDOTstData = 0;
    var totalsData = 0;
    
    var filters = FilterStore.getState();

    var poDOTstClicksQuery = {
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
      "group": ["cpc_influencer"],
      "offset": "0"
    };
    totalsQuery = appendQueryFilters(totalsQuery);

    var tableQuery = {
      "table": "links",
      "fields": [
        { "name": "link_clicks.timestamp_start", "date": true, "alias": "date" },
        {
          "name": "link_clicks.value",
          "sum": true,
          "alias": "post_clicks"
        }
      ],
      "rules": {
        "combinator": "and",
        "rules": [
        ]
      },
      "group": [{"name":"link_clicks.timestamp_start", "date": true}],
      "offset": "0"
    };
    tableQuery = appendQueryFilters(tableQuery, 'link_clicks.timestamp_start');

    var updateProjectedRevenue = function(){
        var selectedInfluencers = _.chain(filters.influencers).filter({enabled: true}).map('id').value();
        var allInfluencers = _.map(filters.influencers, 'id');
        var influencers = selectedInfluencers.length > 0 ? selectedInfluencers : allInfluencers;

        return getProjectedRevenue({}, influencers.join(',')).then(function(data){
            var state = component.state;
            state.projectedRevenue = data.data.data.projectedRevenue;
            component.setState(state);
        });
    }

    var getTotals = function(){
        return runQuery({}, totalsQuery).then(function(data){
            totalsData = data.data.data;
        });
    }

    var getTableData = function(){
        return runQuery({}, tableQuery).then(function(data){
            data = data.data.data;

            var graphData = {};

            _.each(data, function(el){
                if(el.post_clicks){
                    if(!graphData[el.date]){
                        graphData[el.date] = 0;
                    }
                    graphData[el.date] += el.post_clicks;
                }
            });

            graphData = _.map(graphData, function(el,i){
                return {
                    clicks: el,
                    date: moment(i).toDate()
                };
            });

            component.setState({
                graphData: graphData
            });
        });
    }

    var getPoDotStClicks = function(){
        return runQuery({}, poDOTstClicksQuery).then(function(data){
            poDOTstData = data.data.data;
        });
    }

    if(component.revenuePromise){
        component.revenuePromise.cancel();
    }
    component.revenuePromise = updateProjectedRevenue();

    if(component.tablePromise){
        component.tablePromise.cancel();
    }
    component.tablePromise = getTableData();

    if(component.totalsPromise){
        component.totalsPromise.cancel();
    }
    component.totalsPromise = Promise.all([
        getTotals(),
        getPoDotStClicks()
    ]).then(function(){
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

        _.each(totalsData, function(el){
            cardData.totalPosts += el.num_links;
            cardData.estimatedRevenue += el.fb_clicks * el.cpc_influencer;
            cardData.totalClicks += el.fb_clicks;
            totalReach += el.fb_reach;
            totalReachClicks += el.fb_clicks;
        });

        _.each(poDOTstData, function(el){
            cardData.estimatedRevenue += el.post_clicks * el.cpc_influencer;
            cardData.totalClicks += el.post_clicks;
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

        component.setState({
            cardData: cardData
        });
        _.defer(AppActions.loaded);
    })
    .finally(function(){
        _.defer(AppActions.loaded);
    });
}

function appendQueryFilters(query, date_field){
    if(!date_field){
        date_field = 'saved_date';
    }

    var filters = FilterStore.getState();
    if(filters.date_start){
        query.rules.rules.push({
            "field": date_field,
            "operator": ">=",
            "value": filters.analyticsDateRange.date_start
        });
    }

    if(filters.date_end){
        query.rules.rules.push({
            "field": date_field,
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