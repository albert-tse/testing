import React from 'react';
import AltContainer from 'alt-container';

import QuerySource from '../../sources/Query.source';
import InfluencerSource from '../../sources/Influencer.source';
import UserStore from '../../stores/User.store'
import FilterStore from '../../stores/Filter.store'
import AppActions from '../../actions/App.action'

import { Toolbars } from '../toolbar';
import { AppContent } from '../shared';

import Cards from './cards.component';

var runQuery = QuerySource.runQuery().remote;
var getProjectedRevenue = InfluencerSource.projectedRevenue().remote;


/*
import InfluencerStore from '../../stores/Influencer.store'

import InfluencerActions from '../../actions/Influencer.action'


import Widgets from './dashboard/Widgets.component';
import Chart from './dashboard/Chart.component';
import LinksTable from './dashboard/LinksTable.component';
import { main, side, dashboardPanel } from './style';
*/


export default class Analytics extends React.Component {

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
                projectedRevenue: false,
                userRole: UserStore.getState().user.role
            }
        }
    }

    componentDidMount() {
        var thisComponent = this;
        AppActions.loading();
        Promise.all([
            getProjectedRevenue({}, 10).then(function(data){
                thisComponent.state.cardData.projectedRevenue = data.data.data.projectedRevenue;
                thisComponent.setState(thisComponent.state);
                return Promise.resolve(data);
            }),

            getTableData().then(function(data){
                console.log(data);
                return Promise.resolve(data);
            }),

            getPostClicks().then(function(data){
                console.log(data);
                return Promise.resolve(data);
            })
        ])
        .then(function(){
            AppActions.loaded();
        });
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div>
                <Toolbars.Analytics />
                <AppContent id="analytics">
                    <Cards {...this.state.cardData} />
                </AppContent>
            </div>
        );
    }
}

function getPostClicks(){
    var query = {
      "table": "links",
      "fields": [
        {
          "name": "cpc_influencer"
        },
        {
          "name": "link_clicks.value",
          "sum": true,
          "alias": "po-dot-st_clicks"
        },
        {
          "name": "fb_posts.fb_id" //This is included because it triggers a needed join
        },
        {
          "name": "fb_post_stats.clicks" //This is included because it triggers a needed join
        }
      ],
      "rules": {
        "combinator": "and",
        "rules": [
          {
            "field": "fb_post_stats.clicks",
            "operator": "null",
            "value": "null"
          }
        ]
      },
      "group": ["cpc_influencer"],
      "offset": "0"
    };

    query = appendQueryFilters(query);

    return runQuery({}, query);
}

function getTableData(){
    var query = _.extend({}, getFullStats);

    query.rules = {
        "combinator": "and",
        "rules": []
    };

    query = appendQueryFilters(query);

    return runQuery({}, query);
}

function appendQueryFilters(query){
    var filters = FilterStore.getState();
    if(filters.date_start){
        query.rules.rules.push({
            "field": "saved_date",
            "operator": ">=",
            "value": filters.date_start
        });
    }

    if(filters.date_end){
        query.rules.rules.push({
            "field": "saved_date",
            "operator": "<=",
            "value": filters.date_end
        });
    }

    if(filters.influencers){
        query.rules.rules.push({
            "field": "partner_id",
            "operator": "in",
            "value": _.map(filters.influencers, 'id')
        });
    }

    if(filters.platforms){
        query.rules.rules.push({
            "field": "platform_id",
            "operator": "in",
            "value": _.map(filters.platforms, 'id')
        });
    }

    if(filters.sites){
        query.rules.rules.push({
            "field": "site_id",
            "operator": "in",
            "value": _.map(filters.sites, 'id')
        });
    }
    return query;
}

var getTotals = {
    "table": "links",
    "fields": [
        {"name":"id"},
        {"name":"partner_id"},
        {"name":"link"},
        {"name":"shortlink"},
        {"name":"hash"},
        {"name":"title"},
        {"name":"platform_id"},
        {"name":"enabled"},
        {"name":"site_id"},
        {"name":"image"},
        {"name":"description"},
        {"name":"saved_date"},
        {"name":"cpc_influencer"},
        {"name":"ucid"},
        {"name":"sites.name", "alias": "site_name"},
        {"name":"link_clicks.value", "sum":true, "alias": "po-dot-st_clicks"},
        {"name":"link_clicks.timestamp_end", "max":true, "alias": "po-dot-st_clicks_as_of"},
        {"name":"fb_posts.fb_id"},
        {"name":"fb_posts.influencer_id"},
        {"name":"fb_posts.created_time"},
        {"name":"fb_posts.permalink"},
        {"name":"fb_posts.message"},
        {"name":"fb_posts.title"},
        {"name":"fb_posts.description"},
        {"name":"fb_posts.picture"},
        {"name":"fb_post_stats.timestamp"},
        {"name":"fb_post_stats.clicks"},
        {"name":"fb_post_stats.reach"},
        {"name":"fb_post_stats.ctr"},
        {"name":"fb_post_stats.likes"},
        {"name":"fb_post_stats.shares"},
        {"name":"fb_post_stats.comments"}
    ],
    "rules": false,
    "sort": [{"field": "id", "ascending": true}],
    "group": ["id", "title", "description", "shortlink", "hash"],
    "offset": "0"
};

var getFullStats = {
    "table": "links",
    "fields": [
        {"name":"id"},
        {"name":"partner_id"},
        {"name":"link"},
        {"name":"shortlink"},
        {"name":"hash"},
        {"name":"title"},
        {"name":"platform_id"},
        {"name":"enabled"},
        {"name":"site_id"},
        {"name":"image"},
        {"name":"description"},
        {"name":"saved_date"},
        {"name":"cpc_influencer"},
        {"name":"ucid"},
        {"name":"sites.name", "alias": "site_name"},
        {"name":"link_clicks.value", "sum":true, "alias": "po-dot-st_clicks"},
        {"name":"link_clicks.timestamp_end", "max":true, "alias": "po-dot-st_clicks_as_of"},
        {"name":"fb_posts.fb_id"},
        {"name":"fb_posts.influencer_id"},
        {"name":"fb_posts.created_time"},
        {"name":"fb_posts.permalink"},
        {"name":"fb_posts.message"},
        {"name":"fb_posts.title"},
        {"name":"fb_posts.description"},
        {"name":"fb_posts.picture"},
        {"name":"fb_post_stats.timestamp"},
        {"name":"fb_post_stats.clicks"},
        {"name":"fb_post_stats.reach"},
        {"name":"fb_post_stats.ctr"},
        {"name":"fb_post_stats.likes"},
        {"name":"fb_post_stats.shares"},
        {"name":"fb_post_stats.comments"}
    ],
    "rules": false,
    "sort": [{"field": "id", "ascending": true}],
    "group": ["id", "title", "description", "shortlink", "hash"],
    "offset": "0"
};