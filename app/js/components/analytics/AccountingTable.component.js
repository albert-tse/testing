import React, { Component } from 'react';
import { influencer } from './table.style';
import numeral from 'numeral';
import Griddle from 'griddle-react';

export default class AccountingTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section style={{ padding: '0 1rem' }}>
                <Griddle
                    columnMetadata={columnMetadata}
                    columns={['Posted', 'influencer', 'Revenue', 'Reach', 'CTR']}
                    results={results}
                    resultsPerPage={10}
                />
            </section>
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
   "reach":32098,
   "ctr":.082,
   "likes":null,
   "shares":null,
   "comments":null
};

const process = link => Object.assign({}, link, {
    CTR: numeral(link.ctr).format('0.0%') || 0,
    Posted: link.created_time || 'Not Shared',
    influencer: link.influencer_id || 0,
    Reach: link.reach > 999 ? numeral(link.reach).format('0.0a') : (link.reach || 0),
    Revenue: numeral(link['po-dot-st_clicks'] * link.cpc_influencer).format('$0,0.00'),
    site: link.site_id
});

const results = [sampleData, sampleData, sampleData, sampleData, sampleData, sampleData, sampleData, sampleData, sampleData, sampleData].map(process);

const columnMetadata = [
    {
        columnName: 'influencer',
        displayName: '',
        cssClassName: influencer
    }
];
