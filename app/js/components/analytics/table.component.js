import React from 'react';
import AltContainer from 'alt-container';
import Griddle from 'griddle-react';
import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import FontIcon from 'react-toolbox/lib/font_icon';
import Tooltip from 'react-tooltip';
import Config from '../../config';
import QuerySource from '../../sources/Query.source';
import FilterStore from '../../stores/Filter.store';
import UserStore from '../../stores/User.store';
import { avatar, headline, linkTable, linkRow, metadata, sortable, siteName } from './table.style';
import Style from './table.style';

const runQuery = QuerySource.runQuery().remote;

export default class LinksTable extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={LinksTableComponent}
                store={FilterStore}
            />
        );
    }
}

class LinksTableComponent extends React.Component {

    constructor(props) {
        super(props);

        this.isPinned = false;
        this.state = {
            "results": [],
            "currentPage": 0,
            "maxPages": 0,
            "totalLinks": 0,
            "externalResultsPerPage": 25,
            "externalSortColumn": null,
            "externalSortAscending":true,
            "tableIsLoading": true,
            isPinned: false
        };
    }

    componentWillMount(){
        this.getMaxPages();
        this.getExternalData(this.state.externalResultsPerPage, 0);
    }

    componentWillReceiveProps() {
        this.getMaxPages();
        this.setPage(0);
    }

    render() {
        var classnames = Style.linkTable;
        if(this.state.tableIsLoading){
            classnames += ' ' + Style.tableLoading;
        }

        return (
            <div className={classnames} onWheel={::this.checkIfPinned}>
                <Griddle
                    useExternal={true}
                    results={this.state.results}

                    externalCurrentPage={this.state.currentPage}
                    externalSetPage={::this.setPage}
                    externalSetPageSize={::this.setPageSize}
                    externalMaxPage={this.state.maxPages}
                    resultsPerPage={this.state.externalResultsPerPage}

                    externalSetFilter={function(){}}

                    externalChangeSort={::this.changeSort}
                    externalSortColumn={this.state.externalSortColumn}
                    externalSortAscending={this.state.externalSortAscending}

                    showFilter={false}
                    showSettings={false}
                    columns={['partner_id','article_title','site_name','fb_clicks','post_clicks','fb_reach','fb_ctr','fb_shared_date']}
                    columnMetadata={columnMetadata}
                    useFixedLayout={false}
                    useFixedHeader={false}
                    useGriddleStyles={false}
                    tableClassName="table"
                />
            </div>
        );

    }

    checkIfPinned({ currentTarget }) {
        const posY = currentTarget.getBoundingClientRect().top;
        if ( (posY > 128 && this.isPinned) ||
             (posY <= 128 && !this.isPinned) ) {
            this.isPinned = !this.isPinned;
            currentTarget.classList.toggle(Style.pinned, this.isPinned);
        }
    }
    
    setPage(index){
        this.setState(
        {
            "currentPage": index
        });
        this.getExternalData(this.state.externalResultsPerPage, this.state.externalResultsPerPage * index);
    }

    changeSort(sort, sortAscending){
        this.setState(
        {
            "currentPage": 0,
            "externalSortColumn": sort,
            "externalSortAscending": sortAscending

        });

        var update = function(){
            this.getExternalData(this.state.externalResultsPerPage, 0);
        }.bind(this);
        _.defer(update);
    }

    setPageSize(size){
        this.setState({
            currentPage: 0,
            externalResultsPerPage: size,
            maxPages: Math.ceil(this.state.totalLinks / size),
            results: []
        });
        this.getExternalData(size, 0);
    }

    getMaxPages(){
        var component = this;
        var query = {
          "table": "links",
          "fields": [
            {
              "name": "id",
              "count": true,
              "alias": "links"
            }
          ],
          "rules": {
            "combinator": "and",
            "rules": [
            ]
          },
          "offset": "0"
        };
        query = this.appendQueryFilters(query);

        if(this.pageMaxPromise){
            this.pageMaxPromise.cancel();
        }

        this.pageMaxPromise = runQuery({}, query).then(function(data){
            component.setState({
                totalLinks: data.data.data[0].links,
                maxPages: Math.ceil(data.data.data[0].links / component.state.externalResultsPerPage)
            });
        });
    }

    getExternalData(limit, offset){
        var component = this;

        component.setState({
            tableIsLoading: true
        });

        var query = {
            "table": "links",
            "fields": [
                {"name":"id"},
                {"name":"partner_id"},
                {"name":"platform_id"},
                {"name":"site_id"},
                {"name":"ucid"},

                {"name":"link"},
                {"name":"shortlink"},
                {"name":"hash"},
                {"name":"saved_date"},

                {"name":"cpc_influencer"},
                {"name":"post_clicks"},
                {"name":"ga_clicks"},

                {"name":"articles.title",       "alias": "article_title"},
                {"name":"articles.description", "alias": "article_description"},
                {"name":"articles.image", "alias": "article_image"},

                {"name":"sites.name", "alias": "site_name"},

                {"name":"fb_posts.created_time",    "alias": "fb_shared_date"},
                {"name":"fb_posts.permalink",       "alias": "fb_perma_link"},
                {"name":"fb_posts.message",         "alias": "fb_message"},
                {"name":"fb_posts.title",           "alias": "fb_title"},
                {"name":"fb_posts.description",     "alias": "fb_description"},
                {"name":"fb_posts.picture",         "alias": "fb_picture"},


                {"name":"fb_posts.clicks",      "alias": "fb_clicks"},
                {"name":"fb_posts.reach",       "alias": "fb_reach"},
                {"name":"fb_posts.ctr",         "alias": "fb_ctr"},
                {"name":"fb_posts.likes",       "alias": "fb_likes"},
                {"name":"fb_posts.shares",      "alias": "fb_shares"},
                {"name":"fb_posts.comments",    "alias": "fb_comments"},
            ],
            "rules": {
                "combinator": "and",
                "rules": [
                ]
            },
            "group": ["id", "shortlink", "hash"]
        };

        if(this.state.externalSortColumn == 'partner_id'){
            query.sort = [{field:"partner_id", ascending: this.state.externalSortAscending}];

        }else if(this.state.externalSortColumn == 'article_title'){
            query.sort = [{field:"articles.title", ascending: this.state.externalSortAscending}];

        }else if(this.state.externalSortColumn == 'site_name'){
            query.sort = [{field:"sites.name", ascending: this.state.externalSortAscending}];

        }else if(this.state.externalSortColumn == 'post_clicks'){
            query.sort = [{field:"post_clicks", ascending: this.state.externalSortAscending}];
        }else if(this.state.externalSortColumn == 'fb_clicks'){
            query.sort = [{field:"fb_posts.clicks", ascending: this.state.externalSortAscending}];

        }else if(this.state.externalSortColumn == 'fb_reach'){
            query.sort = [{field:"fb_posts.reach", ascending: this.state.externalSortAscending}];

        }else if(this.state.externalSortColumn == 'fb_ctr'){
            query.sort = [{field:"fb_posts.ctr", ascending: this.state.externalSortAscending}];

        }else if(this.state.externalSortColumn == 'fb_shared_date'){
            query.sort = [{field:"fb_posts.created_time", ascending: !this.state.externalSortAscending}];

        }else{
            query.sort = [{field:"saved_date", ascending: !this.state.externalSortAscending}]
        }

        query.limit = limit;
        query.offset = offset;

        query = this.appendQueryFilters(query);
        if(this.tableDataPromise){
            this.tableDataPromise.cancel();
        }

        this.tableDataPromise = runQuery({}, query).then(function(data){
            component.setState({
                results: data.data.data,
                tableIsLoading: false
            });
        });

    }

    appendQueryFilters(query){
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


}

const influencerComponent = ({rowData}) => {
    var influencer =  _.find(UserStore.getState().user.influencers, {id: rowData.partner_id});

    if(!influencer){
        influencer = {};
    }

    if(!influencer.fb_profile_image){
        influencer.fb_profile_image = 'http://www.gravatar.com/avatar/?d=mm';
    }

    if(!influencer.name){
        influencer.name = '';
    }

    var platform;

    if(rowData.platform_id == 2 && rowData.fb_perma_link){
        platform = <a target="_new" href={rowData.fb_perma_link}>{Config.platforms[rowData.platform_id].name}</a>;
    } else {
        platform = Config.platforms[rowData.platform_id].name;
    }

    return (
        <article className={linkRow}>
            <img className={avatar} src={influencer.fb_profile_image} />
            <p>{influencer.name}</p>
            <p>{platform}</p>
        </article>
    );
};

const titleComponent = ({rowData}) => {
    let displayImage = rowData.article_image;

    if (rowData.fb_picture) {
        displayImage = rowData.fb_picture;
    }

    return (
        <div>
            <img src={displayImage} />
            <span className={Style.titleText}><a href={'http://qklnk.co/' + rowData.hash} target="_new">{rowData.article_title}<FontIcon value='open_in_new' /></a></span>
        </div>
    );
};

const siteComponent = ({rowData}) => {
    return (
        <span>{rowData.site_name}<a href={'http://qklnk.co/' + rowData.hash} target="_new"><FontIcon value='open_in_new' /></a></span>
    );
};

const revenueComponent = ({rowData}) => {
    var clicks = 0;
    if(rowData.fb_clicks){
        if(rowData.fb_clicks > 100){
            clicks = rowData.fb_clicks;
        }
    }else if(rowData.post_clicks){
        if(rowData.post_clicks > 100){
            clicks = rowData.post_clicks;
        }
    }

    var revenue = '-- --';

    if(clicks){
        revenue = numeral(clicks * rowData.cpc_influencer).format('$0,0.00');
    }

    return (
        <span>
            <a data-tip data-for={`revenue-${rowData.id}`}>{revenue}</a>
            <Tooltip id={`revenue-${rowData.id}`} place="top" type="dark" effect="float">
              <div>
                <div>Total Clicks: {clicks}</div>
              </div>
            </Tooltip>
        </span>
    );
};

const clicksComponent = ({rowData}) => {
    var clicks = 0;
    if(rowData.fb_clicks){
        if(rowData.fb_clicks > 100){
            clicks = rowData.fb_clicks;
        }
    }else if(rowData.post_clicks){
        if(rowData.post_clicks > 100){
            clicks = rowData.post_clicks;
        }
    }

    var display = '-- --';
    if(clicks){
        display = numeral(clicks).format('0,0');
    }

    return (
        <span>
            {display}
        </span>
    );
};

const reachComponent = ({rowData}) => {
    var tooltipid = 'no-tooltip';
    var reach = '-- --';
    if(rowData.fb_clicks > 100 && rowData.fb_reach){
        tooltipid = `reach-${rowData.id}`;
        reach = numeral(rowData.fb_reach).format('0a');
    }

    return (
        <span>
            <a data-tip data-for={`reach-${rowData.id}`}>{ reach }</a>
            <Tooltip id={tooltipid} place="top" type="dark" effect="float">
              <div>
                <div>Likes: {rowData.fb_likes}</div>
                <div>Comments: {rowData.fb_comments}</div>
                <div>Shares: {rowData.fb_shares}</div>
              </div>
            </Tooltip>
        </span>
    );
};

const ctrComponent = ({rowData}) => {
    var tooltipid = 'no-tooltip';
    var ctr = '-- --';
    if(rowData.fb_clicks > 100 && rowData.fb_reach){
        tooltipid = `ctr-${rowData.id}`;
        ctr = numeral(rowData.fb_clicks / rowData.fb_reach).format('0.00a%');
    }

    return (
        <span>
            <a data-tip data-for={`ctr-${rowData.id}`}>{ ctr }</a>
            <Tooltip id={tooltipid} place="top" type="dark" effect="float" enabled={false}>
              <div>
                <div>Likes: {rowData.fb_likes}</div>
                <div>Comments: {rowData.fb_comments}</div>
                <div>Shares: {rowData.fb_shares}</div>
              </div>
            </Tooltip>
        </span>
    );
};

const sharedDateComponent = ({rowData}) => {
    if(rowData.fb_clicks > 100 && rowData.fb_shared_date){
        return (
            <span>
                <a data-tip data-for={`shared-date-${rowData.id}`}> {moment.utc(rowData.fb_shared_date).local().fromNow()} </a>
                <Tooltip id={`shared-date-${rowData.id}`} place="top" type="dark" effect="float">
                  <div>
                    {moment.utc(rowData.fb_shared_date).local().format("dddd, MMMM Do YYYY, h:mm:ss a")}
                  </div>
                </Tooltip>
            </span>
        );
    }

    return (
        <span> -- -- </span>
    );
};

const columnMetadata = [
    {
        columnName: 'partner_id',
        displayName: 'Influencer',
        cssClassName: Style.influencer,
        customComponent: influencerComponent,
        sortDirectionCycle: ['asc', 'desc']
    },
    {
        columnName: 'article_title',
        displayName: 'Post',
        cssClassName: Style.title,
        customComponent: titleComponent,
        sortDirectionCycle: ['asc', 'desc']
    },
    {
        columnName: 'site_name',
        displayName: 'Site',
        cssClassName: Style.site,
        customComponent: siteComponent,
        sortDirectionCycle: ['asc', 'desc']
    },
    {
        columnName: 'fb_clicks',
        displayName: 'Clicks',
        cssClassName: Style.clicks,
        customComponent: clicksComponent,
        sortDirectionCycle: ['asc', 'desc']
    },
    {
        columnName: 'post_clicks',
        displayName: 'Revenue',
        cssClassName: Style.revenue,
        customComponent: revenueComponent,
        sortDirectionCycle: ['asc', 'desc']
    },
    {
        columnName: 'fb_reach',
        displayName: 'Reach',
        cssClassName: Style.reach,
        customComponent: reachComponent,
        sortDirectionCycle: ['asc', 'desc']
    },
    {
        columnName: 'fb_ctr',
        displayName: 'CTR',
        cssClassName: Style.ctr,
        customComponent: ctrComponent,
        sortDirectionCycle: ['asc', 'desc']
    },
    {
        columnName: 'fb_shared_date',
        displayName: 'Shared Date',
        cssClassName: Style.sharedate,
        customComponent: sharedDateComponent,
        sortDirectionCycle: ['asc', 'desc']
    }
];
