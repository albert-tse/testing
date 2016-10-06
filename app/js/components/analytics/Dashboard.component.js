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
import Table from './table.component';
import { content } from './styles';

const runQuery = QuerySource.runQuery().remote;
const getProjectedRevenue = InfluencerSource.projectedRevenue().remote;

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            cardData: {
                estimatedRevenue: false,
                totalLinkCount: false,
                totalReachPosts: false,
                totalSharedLinks: false,
                averageRevenuePerPost: false,
                totalClicks: false,
                averageClicksPerPost: false,
                averageCtrPerPost: false,
                averageReachPerPost: false,
                postsPerDay: false,
                clicksPerDay: false,
                reachPerDay: false,
                userRole: UserStore.getState().user.role
            }
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

    render() {
        return (
            <div className={content}>
                <Toolbars.Analytics />
                <AppContent id="analytics">
                    {this.state.isLoading ? <div/> : (
                        <div>
                            <Cards {...this.state.cardData} projectedRevenue={this.state.projectedRevenue}/>
                            <Table />
                        </div>
                    )}
                </AppContent>
            </div>
        );
    }

    onFilterChange(){
        updateAggregateStats(this);
    }

}

function updateAggregateStats(component){
    _.defer(AppActions.loading);

    component.setState({
        isLoading: true,
        cardData: {
            estimatedRevenue: false,
            totalLinkCount: false,
            totalReachPosts: false,
            totalSharedLinks: false,
            averageRevenuePerPost: false,
            totalClicks: false,
            averageClicksPerPost: false,
            averageCtrPerPost: false,
            averageReachPerPost: false,
            postsPerDay: false,
            clicksPerDay: false,
            reachPerDay: false,
            userRole: UserStore.getState().user.role
        }
    });
    var poDOTstData = 0;
    var totalsData = 0;
    
    var filters = FilterStore.getState();

    // This query is designed to get all links that have clicks in po.st but not in FB. We'll combine the results of this query with the totalsQuery below.
    // The query also counts the number of links that match this conditional
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
        {
          "name": "id",
          "count_distinct": true,
          "alias": "count_links"
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
          },
          {
            "field": "post_clicks",
            "operator": "notNull",
            "value": "null"
          }
        ]
      },
      "group": [{"name":"links.saved_date", "date": true}, "cpc_influencer"],
      "offset": "0"
    };
    poDOTstClicksQuery = appendQueryFilters(poDOTstClicksQuery);

    // This query is designed to get all links with the associated fb_posts row if it exists, and calculating the sums for FB clicks and reach.
    // The query also counts the total number of links created and links that have been shared on FB
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
        },
        {
            "name": "fb_posts.id",
            "count_distinct": true,
            "alias": "fb_posts"
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

    var updateProjectedRevenue = function(){
        var selectedInfluencers = _.chain(filters.influencers).filter({enabled: true}).map('id').value();
        var allInfluencers = _.map(filters.influencers, 'id');
        var influencers = selectedInfluencers.length > 0 ? selectedInfluencers : allInfluencers;

        return getProjectedRevenue({}, influencers.join(',')).then(function(data){
            var state = component.state;
            state.projectedRevenue = data.data.data.projectedRevenue;
            state.isLoading = false;
            component.setState(state);
        });
    }

    var getTotals = function(){
        return runQuery({}, totalsQuery).then(function(data){
            totalsData = data.data.data;
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
            totalLinkCount: 0,
            totalReachPosts: 0,
            totalSharedLinks: 0,
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

        // Calculate the totals for the links that have FB data
        _.each(totalsData, function(el){
            cardData.totalLinkCount += el.num_links;
            cardData.estimatedRevenue += el.fb_clicks * el.cpc_influencer;
            cardData.totalClicks += el.fb_clicks;
            totalReach += el.fb_reach;
            totalReachClicks += el.fb_clicks;
            cardData.totalReachPosts += el.fb_posts;
            cardData.totalSharedLinks += el.fb_posts;
        });

        // Calculate the totals for links that don't have FB data, but do have po.st data
        _.each(poDOTstData, function(el){
            cardData.estimatedRevenue += el.post_clicks * el.cpc_influencer;
            cardData.totalClicks += el.post_clicks;
            cardData.totalSharedLinks += el.count_links;
        });


        // Average revenue and clicks per post are calculated using the total number of links that have actually been shared
        cardData.averageRevenuePerPost = cardData.estimatedRevenue / cardData.totalSharedLinks;
        cardData.averageClicksPerPost = cardData.totalClicks / cardData.totalSharedLinks;

        // Avereage reach per post is calculated using the total number of links that have been shared on FB
        cardData.averageReachPerPost = totalReach / cardData.totalReachPosts;

        cardData.averageCtrPerPost = (totalReachClicks / totalReach);

        // Determine the number of days included in this query
        var num_days = moment(filters.analyticsDateRange.date_end).diff(moment(filters.analyticsDateRange.date_start), 'days');

        // Posts per day is the number of links that were shared per day
        cardData.postsPerDay = cardData.totalSharedLinks / num_days;
        cardData.clicksPerDay = cardData.totalClicks / num_days;
        cardData.reachPerDay = totalReach / num_days;

        _.each(cardData, function(el,i){
            if(isNaN(el) && i != 'userRole'){
                cardData[i] = false;
            }
        });

        const changes = { cardData };
        component.setState(changes);
        return changes;
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
