import React from 'react';
import AltContainer from 'alt-container';

import QuerySource from '../../sources/Query.source';
import AppActions from '../../actions/App.action'

import { Toolbars } from '../toolbar';
import { AppContent } from '../shared';

var runQuery = QuerySource.runQuery().remote;


/*
import InfluencerStore from '../../stores/Influencer.store'
import UserStore from '../../stores/User.store'
import InfluencerActions from '../../actions/Influencer.action'


import Widgets from './dashboard/Widgets.component';
import Chart from './dashboard/Chart.component';
import LinksTable from './dashboard/LinksTable.component';
import { main, side, dashboardPanel } from './style';
*/


export default class Analytics extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        AppActions.loading();
        runQuery({}, getFullStats).then(function(data){
            console.log(data);
            AppActions.loaded();
        });
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <div>
                <Toolbars.Analytics />
                <AppContent id="sharedlinks">

                </AppContent>
            </div>
        );
    }
}

var getFullStats = {
    "table": "links",
    "fields": [
        {"name":"id"},
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

/*
<AppContent id="sharedlinks" className={dashboardPanel}>
                    <div className={dashboardPanel}>
                        <Widgets />
                        <Chart />
                        <LinksTable />
                    </div>

                    */