import React, { Component } from 'react';
import Widget from './Widget.component';
import Griddle from 'griddle-react';
import { AppContent } from '../shared';
import { Toolbars } from '../toolbar';
import numeral from 'numeral';
import { widgetContainer } from './cards.style';
import { content } from './styles';

export default class Accounting extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const estimatedRevenue = 102993.89;
        const projectedRevenueLabel = 'Project Revenue (Aug 2016)';
        const projectedRevenue = 189300.00;
        const totalPosts = 3000992;

        console.log('results', results);

        return (
            <div className={content}>
                <Toolbars.Accounting />
                <AppContent>
                    <section className={widgetContainer}>
                        <Widget label="Estimated Revenue" value={estimatedRevenue === false ? false : numeral(estimatedRevenue).format('$0,0.00')} />
                        <Widget label={projectedRevenueLabel} value={projectedRevenue === false ? false : numeral(projectedRevenue).format('$0,0.00')} />
                        <Widget label="Total Posts" value={ totalPosts > 999 ? numeral(totalPosts).format('0.00a') : totalPosts } />
                    </section>
                    <section style={{ padding: '0 1rem' }}>
                        <Griddle
                            columns={['influencer', 'site', 'title', 'revenue', 'reach', 'ctr', 'created_time']}
                            results={results}
                            resultsPerPage={10}
                        />
                    </section>
                </AppContent>
            </div>
        );
    }

}

const sampleData = {
   "id":123596,
   "partner_id":127,
   "link":"http://www.simplemost.com/14-easy-freezer-meals-will-help-mix-weeknight-dinners/?utm_content=inf_127_3489_2&utm_source=facebook&utm_medium=partner&utm_campaign=wildhair&tse_id=INF_7bb0dfe0630e11e6bb92a1d998511fda",
   "shortlink":"http://po.st/2T0Z2x",
   "hash":"2T0Z2x",
   "article_title":"These 14 Easy Freezer Meals Will Help You Mix Up Your Weeknight Dinners",
   "platform_id":2,
   "enabled":1,
   "site_id":3489,
   "image":"",
   "description":null,
   "title":"These 14 Easy Freezer Meals Will Help You Mix Up Your Weeknight Dinners",
   "saved_date":"2016-08-15 17:34:16",
   "cpc_influencer":0.0025,
   "ucid":711139,
   "site_name":"Simple Most",
   "po-dot-st_clicks":561,
   "po-dot-st_clicks_as_of":"2016-08-17 04:00:00",
   "fb_id":null,
   "influencer_id":null,
   "created_time":null,
   "permalink":null,
   "message":null,
   "fb_title":null,
   "picture":null,
   "timestamp":null,
   "clicks":null,
   "reach":null,
   "ctr":null,
   "likes":null,
   "shares":null,
   "comments":null
};

const process = link => Object.assign({}, link, {
    ctr: link.ctr || 0,
    created_time: link.created_time || 'Not Shared',
    influencer: link.influencer_id || 0,
    reach: link.reach || 0,
    revenue: link['po-dot-st_clicks'] * link.cpc_influencer,
    site: link.site_id
});
const results = [sampleData, sampleData, sampleData, sampleData, sampleData, sampleData, sampleData].map(process);
