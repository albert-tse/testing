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

var runQuery = QuerySource.runQuery().remote;

export default class LinksTable extends React.Component { 

    constructor(props) {
        super(props);

        this.state = { 
            "results": [],
            "currentPage": 0,
            "maxPages": 0,
            "totalLinks": 0,
            "externalResultsPerPage": 25,
            "externalSortColumn":null,
            "externalSortAscending":true
        };
    }

    componentWillMount(){
        ::this.getMaxPages();
        ::this.getExternalData(this.state.externalResultsPerPage, 0);
    }

    componentDidMount() {
        FilterStore.listen(::this.onFilterChange);
        UserStore.listen(::this.onFilterChange);
    }

    componentWillUnmount() {
        FilterStore.unlisten(::this.onFilterChange);
        UserStore.unlisten(::this.onFilterChange);
    }

    onFilterChange(){
        ::this.setPage(0);
    }

    setPage(index){
        this.setState(
        {
            "currentPage": index
        });
        ::this.getExternalData(this.state.externalResultsPerPage, this.state.externalResultsPerPage * index);
    }
    
    sortData(sort, sortAscending, data){
      //sorting should generally happen wherever the data is coming from 
      sortedData = _.sortBy(data, function(item){
        return item[sort];
      });

      if(sortAscending === false){
        sortedData.reverse();
      }
      return {
        "currentPage": 0,
        "externalSortColumn": sort,
        "externalSortAscending": sortAscending,
        "pretendServerData": sortedData,
        "results": sortedData.slice(0,this.state.externalResultsPerPage)
      };
    }

    changeSort(sort, sortAscending){
      //this should change the sort for the given column
      this.setState(this.sortData(sort, sortAscending, this.state.pretendServerData));
    }

    setPageSize(size){
        this.setState({
            currentPage: 0,
            externalResultsPerPage: size,
            maxPages: Math.ceil(this.state.totalLinks / size),
            results: []
        });
        ::this.getExternalData(size, 0);
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
        runQuery({}, query).then(function(data){
            component.setState({
                totalLinks: data.data.data[0].links,
                maxPages: Math.ceil(data.data.data[0].links / component.state.externalResultsPerPage)
            });
        });
    }

    getExternalData(limit, offset){
        var component = this;
        var query = {
            "table": "links",
            "fields": [
                {"name":"id"},
                {"name":"partner_id"},
                {"name":"link"},
                {"name":"shortlink"},
                {"name":"hash"},
                {"name":"articles.title", "alias": "article_title"},
                {"name":"platform_id"},
                {"name":"enabled"},
                {"name":"site_id"},
                {"name":"image"},
                {"name":"articles.description"},
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
            "rules": {
                "combinator": "and",
                "rules": [
                ]
            },
            "sort": [{"field": "id", "ascending": true}],
            "order": [{field:"saved_date", ascending: false}],
            "group": ["id", "shortlink", "hash"]
        };

        query.limit = limit;
        query.offset = offset;

        query = this.appendQueryFilters(query);
        runQuery({}, query).then(function(data){
            component.setState({
                results: data.data.data
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

        /*var influencers = _.chain(filters.influencers).filter({enabled: true}).map('id').value();
        if(influencers.length == 0){
            influencers = _.chain(filters.influencers).map('id').value();
        }

        query.rules.rules.push({
            "field": "partner_id",
            "operator": "in",
            "value": influencers
        });*/

        query.rules.rules.push({
            "field": "partner_id",
            "operator": "=",
            "value": UserStore.getState().selectedInfluencer.id
        });

        if(filters.platforms && _.filter(filters.platforms, {enabled: true}).length > 0){
            query.rules.rules.push({
                "field": "platform_id",
                "operator": "in",
                "value": _.chain(filters.platforms).filter({enabled: true}).map('id')
            });
        }

        if(filters.sites && _.filter(filters.sites, {enabled: true}).length > 0){
            query.rules.rules.push({
                "field": "site_id",
                "operator": "in",
                "value": _.chain(filters.sites).filter({enabled: true}).map('id')
            });
        }
        return query;
    }

    render() {
        return (
            <div className={Style.linkTable}>
                <Griddle 
                    useExternal={true} 
                    externalSetPage={::this.setPage}
                    externalChangeSort={::this.changeSort}
                    externalSetPageSize={::this.setPageSize} 
                    externalSetFilter={function(){}}
                    externalMaxPage={this.state.maxPages}
                    externalCurrentPage={this.state.currentPage} 
                    results={this.state.results} 
                    resultsPerPage={this.state.externalResultsPerPage}
                    externalSortColumn={this.state.externalSortColumn} 
                    externalSortAscending={this.state.externalSortAscending} 
                    showFilter={false} 
                    showSettings={false} 


                    columns={['partner_id','title','site_name','po-dot-st_clicks','reach','clicks','created_time']}
                    columnMetadata={columnMetadata}

                    enableInfiniteScroll={false}
                    useFixedLayout={false}
                    useFixedHeader={true}
                    bodyHeight={480}
                    tableClassName="table" 
                />
            </div>
        );

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

    if(rowData.platform_id == 2 && rowData.permalink){
        platform = <a target="_new" href={rowData.permalink}>{Config.platforms[rowData.platform_id].name}</a>;
    } else {
        platform = Config.platforms[rowData.platform_id].name;
    }

    return (
        <article className={linkRow}>
            <img className={avatar} src={influencer.fb_profile_image} />
            <section className={headline}>
                <p className={siteName}>{rowData.site_name}</p>
                {rowData.title}
                <footer className={metadata}>
                    {influencer.name} - {platform}
                </footer>
            </section>
        </article>
    );
};

const titleComponent = ({rowData}) => {
    return (
        <span>{rowData.article_title}<a href={'http://qklnk.co/' + rowData.hash} target="_new"><FontIcon value='open_in_new' /></a></span>
    );
};

const siteComponent = ({rowData}) => {
    return (
        <span>{rowData.site_name}<a href={'http://qklnk.co/' + rowData.hash} target="_new"><FontIcon value='open_in_new' /></a></span>
    );
};

const revenueComponent = ({rowData}) => {
    var clicks = false;
    if(rowData.clicks){
        if(rowData.clicks > 100){
            clicks = rowData.clicks;
        }
    }else if(rowData['po-dot-st_clicks']){
        if(rowData['po-dot-st_clicks'] > 100){
            clicks = rowData['po-dot-st_clicks'];
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

const reachComponent = ({rowData}) => {
    var clicks = false;
    if(rowData.clicks){
        if(rowData.clicks > 100){
            clicks = rowData.clicks;
        }
    }else if(rowData['po-dot-st_clicks']){
        if(rowData['po-dot-st_clicks'] > 100){
            clicks = rowData['po-dot-st_clicks'];
        }
    }

    var tooltipid = 'no-tooltip';
    if(rowData.clicks && rowData.reach){
        tooltipid = `reach-${rowData.id}`;
    }

    return (
        <span>
            <a data-tip data-for={`reach-${rowData.id}`}>{clicks > 100 && rowData.reach? numeral(rowData.reach).format('0a') : '-- --'}</a>
            <Tooltip id={tooltipid} place="top" type="dark" effect="float">
              <div>
                <div>Likes: {rowData.likes}</div>
                <div>Comments: {rowData.comments}</div>
                <div>Shares: {rowData.shares}</div>
              </div>
            </Tooltip>
        </span>
    );
};

const ctrComponent = ({rowData}) => {
    var clicks = false;
    if(rowData.clicks){
        if(rowData.clicks > 100){
            clicks = rowData.clicks;
        }
    }else if(rowData['po-dot-st_clicks']){
        if(rowData['po-dot-st_clicks'] > 100){
            clicks = rowData['po-dot-st_clicks'];
        }
    }

    var tooltipid = 'no-tooltip';
    if(rowData.clicks && rowData.reach){
        tooltipid = `ctr-${rowData.id}`;
    }

    return (
        <span>
            <a data-tip data-for={`ctr-${rowData.id}`}>{clicks > 100 && rowData.reach? numeral((clicks / rowData.reach)*100).format('0.00a') : '-- --'}</a>
            <Tooltip id={tooltipid} place="top" type="dark" effect="float" enabled={false}>
              <div>
                <div>Likes: {rowData.likes}</div>
                <div>Comments: {rowData.comments}</div>
                <div>Shares: {rowData.shares}</div>
              </div>
            </Tooltip>
        </span>
    );
};

const sharedDateComponent = ({rowData}) => {
    if(rowData.clicks){
        if(rowData.clicks > 100 && rowData.created_time){
            return (
                <span>
                    <a data-tip data-for={`shared-date-${rowData.id}`}> {moment.utc(rowData.created_time).local().fromNow()} </a>
                    <Tooltip id={`shared-date-${rowData.id}`} place="top" type="dark" effect="float">
                      <div>
                        {moment.utc(rowData.created_time).local().format("dddd, MMMM Do YYYY, h:mm:ss a")}
                      </div>
                    </Tooltip>
                </span>
            );
        }
    }

    return (
        <span>
            -- --
        </span>
    );
};

const columnMetadata = [
    {
        columnName: 'partner_id',
        displayName: 'Influencer',
        sortable: false,
        cssClassName: Style.influencer,
        customComponent: influencerComponent
    },
    {
        columnName: 'title',
        displayName: 'Title',
        sortable: false,
        cssClassName: Style.title,
        customComponent: titleComponent
    },
    {
        columnName: 'site_name',
        displayName: 'Site',
        sortable: false,
        cssClassName: Style.site,
        customComponent: siteComponent
    },
    {
        columnName: 'po-dot-st_clicks',
        displayName: 'Revenue',
        sortable: false,
        cssClassName: Style.revenue,
        customComponent: revenueComponent
    },
    {
        columnName: 'reach',
        displayName: 'Reach',
        sortable: false,
        cssClassName: Style.reach,
        customComponent: reachComponent
    },
    {
        columnName: 'clicks',
        displayName: 'CTR',
        sortable: false,
        cssClassName: Style.ctr,
        customComponent: ctrComponent
    },
    {
        columnName: 'created_time',
        displayName: 'Shared Date',
        sortable: false,
        cssClassName: Style.sharedate,
        customComponent: sharedDateComponent
    }
];