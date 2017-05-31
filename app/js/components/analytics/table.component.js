import React from 'react';
import AltContainer from 'alt-container';
import { findDOMNode } from 'react-dom';
import Griddle, { RowDefinition, ColumnDefinition, Pagination } from 'griddle-react';
import FontIcon from 'react-toolbox/lib/font_icon';
import Tooltip from 'react-tooltip';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';

import Config from '../../config';
import { isMobilePhone } from '../../utils';

import QuerySource from '../../sources/Query.source';
import FilterStore from '../../stores/Filter.store';
import UserStore from '../../stores/User.store';
import ShareDialogStore from '../../stores/ShareDialog.store';

import LinkCellActions from '../shared/LinkCellActions';
import LinkComponent from './Link.component';
import ArticleDialogs from '../shared/article/ArticleDialogs.component';
import PageDropdown from '../pagination/PageDropdown.component';
import { rowDataSelector, enhancedWithRowData, MinimalLayout, dashboardStyleConfig, sortByTitle, cloneTableHeaderForPinning } from './utils';

import Style from './table.style';

export default class LinksTable extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={LinksTableComponent}
                stores={{
                    filters: FilterStore,
                    shareDialog: ShareDialogStore
                }}
                transform={({filters, shareDialog}) => ({
                    ...filters,
                    isScheduling: shareDialog.isScheduling
                })}
            />
        );
    }
}

class LinksTableComponent extends React.Component {

    constructor(props) {
        super(props);

        this.isPinned = false;
        this.isMobile = isMobilePhone();
        this.tableContainer = null;
        this.setPreviewArticle = this.setPreviewArticle.bind(this);
        this.resetPreviewArticle = this.resetPreviewArticle.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.fetchNext = this.fetchNext.bind(this);
        this.fetchPrevious = this.fetchPrevious.bind(this);
        this.changeSorting = this.changeSorting.bind(this);
        this.updateRecordCount = this.updateRecordCount.bind(this);
        this.cloneTableHeaderForPinning = cloneTableHeaderForPinning.bind(this);

        this.state = {
            data: [],
            currentPage: 1,
            pageSize: 25,
            recordCount: 0,
            sortProperties: [],
            previewArticle: null,
            isPinned: false,
            createdStickyHeader: false,
            currentSortedColumn: {}
        };

        this.clonedTableHeader = false;
    }

    componentDidMount(){
        this.fetchData(1);
    }

    componentDidUpdate(prevProps, prevState) {
        setTimeout(then => {
            const tableContainer = findDOMNode(this.table).querySelector('table');
            if (!this.clonedTableHeader && tableContainer !== null) {
                this.cloneTableHeaderForPinning(this.table);
                this.clonedTableHeader = true;
            }

        }, 0);

        if (prevProps.isScheduling && !this.props.isScheduling) {
            this.setState({ previewArticle: null });
        }
    }

    render() {
        const classNames = classnames(Style.dashboard, Style.linksTable, this.state.tableIsLoading && Style.tableLoading);
        const { data, currentPage, pageSize, recordCount } = this.state;

        return (
            <div className={classNames} ref={table => this.table = table}>
                <Griddle
                    data={data}
                    pageProperties={{
                        currentPage,
                        pageSize,
                        recordCount
                    }}
                    sortProperties={this.state.sortProperties}
                    events={{
                        onGetPage: this.fetchData,
                        onNext: this.fetchNext,
                        onPrevious: this.fetchPrevious,
                        onSort: this.changeSorting
                    }}
                    components={{
                        Layout: MinimalLayout,
                        PreviousButton: props => <span />,
                        NextButton: props => <span />,
                        PageDropdown: props => (
                            <PageDropdown
                                {...props}
                                currentPage={this.state.currentPage}
                                totalItemsCount={this.state.recordCount}
                            />
                        )
                    }}
                    styleConfig={{
                        classNames: {
                            Table: classNames
                        }
                    }}
                >
                    <RowDefinition>
                        <ColumnDefinition
                            id="partner_id"
                            title="Influencer"
                            customComponent={enhancedWithRowData(influencerComponent)}
                            cssClassName={Style.influencer}
                            headerCssClassName={Style.influencer}
                            visible={!this.isMobile}
                        />
                        <ColumnDefinition
                            id="article_title"
                            title="Post"
                            customComponent={enhancedWithRowData(titleComponent)}
                            cssClassName={Style.title}
                            headerCssClassName={Style.title}
                        />
                        <ColumnDefinition
                            id="site_name"
                            title="Site"
                            customComponent={enhancedWithRowData(siteComponent)}
                            cssClassName={Style.site}
                            headerCssClassName={Style.site}
                            visible={!this.isMobile}
                        />
                        <ColumnDefinition
                            id="fb_clicks"
                            title="Clicks"
                            customComponent={enhancedWithRowData(clicksComponent)}
                            cssClassName={Style.clicks}
                            headerCssClassName={Style.clicks}
                        />
                        <ColumnDefinition
                            id="fb_reach"
                            title="Reach"
                            customComponent={enhancedWithRowData(reachComponent)}
                            cssClassName={Style.reach}
                            headerCssClassName={Style.reach}
                        />
                        <ColumnDefinition
                            id="fb_ctr"
                            title="CTR"
                            customComponent={enhancedWithRowData(ctrComponent)}
                            cssClassName={Style.ctr}
                            headerCssClassName={Style.ctr}
                        />
                        <ColumnDefinition
                            id="fb_shared_date"
                            title="Shared"
                            customComponent={enhancedWithRowData(sharedDateComponent)}
                            cssClassName={Style.sharedate}
                            headerCssClassName={Style.sharedate}
                            visible={!this.isMobile}
                        />
                        <ColumnDefinition
                            id="hash"
                            title=" "
                            customComponent={enhancedWithRowData(props => (
                                <LinkCellActions className={Style.showOnHover} props={props} setPreviewArticle={this.setPreviewArticle} />
                            ))}
                            cssClassName={Style.actions}
                            headerCssClassName={Style.actions}
                            visible={!this.isMobile}
                        />
                    </RowDefinition>
                </Griddle>
                <ArticleDialogs previewArticle={this.state.previewArticle} resetPreviewArticle={this.resetPreviewArticle}/>
            </div>
        );

        /*
        return (
            <div className={classnames}>
                <Griddle
                    ref={ table => this.table = table }
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

                    columns={this.getColumns()}
                    columnMetadata={this.isMobile ? columnMetadataMobile(this) : columnMetadata(this)}
                    useGriddleStyles={false}
                />
            </div>
        );*/

    }

    /**
     * Request data for the table from server
     * @param {int} currentPage offset from which to query on
     */
    fetchData(currentPage) {
        const { pageSize } = this.state;
        this.getRecordCount();
        this.getExternalData(pageSize, pageSize * (currentPage - 1));
        this.setState({ currentPage });
    }

    /**
     * Request next page of data from server
     */
    fetchNext() {
        const { currentPage, pageSize } = this.state;
        const nextPage = currentPage + 1;
        this.getExternalData(pageSize, pageSize * (nextPage - 1));
        this.setState({ currentPage: nextPage })
    }

    /**
     * Request previous page of data from server
     */
    fetchPrevious() {
        const { currentPage, pageSize } = this.state;
        const previousPage = currentPage - 1;
        this.getExternalData(pageSize, pageSize * (previousPage - 1));
        this.setState({ currentPage: previousPage });
    }

    /**
     * Change the column that is being sorted and fetch new data
     * @param {Object} sortProperties identifies which column is going to be sorted
     */
    changeSorting(sortProperties) {
        const { currentSortedColumn } = this.state;
        let newSortedColumn = {};

        if (typeof currentSortedColumn.id !== 'undefined' && currentSortedColumn.id === sortProperties.id) { // we flip the order
            newSortedColumn = { ...currentSortedColumn, sortAscending: !currentSortedColumn.sortAscending };
        } else {
            newSortedColumn = {
                id: sortProperties.id,
                sortAscending: true
            };
        }

        this.setState({
            currentSortedColumn: newSortedColumn,
            sortProperties: [newSortedColumn]
        }, then => this.fetchData(1));
    }

    /**
     * Determine how many records there are in total for current request
     */
    getRecordCount() {
        let query = {
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

        if(this.promiseToGetRecordCount){
            this.promiseToGetRecordCount.cancel(); // cancel request if same request already exists and is just pending
        } else {
            this.promiseToGetRecordCount = runQuery({}, query).then(this.updateRecordCount);
        }
    }

    /**
     * Updates the record count of new request
     * @param {Object} payload response from server containing links count
     */
    updateRecordCount(payload) {
        this.setState({
            recordCount: payload.data.data[0].links,
        });
    }

    /**
     * Fetch data from server given current filters
     * @param {int} limit how many links to fetch
     * @param {int} offset determines which page
     */
    getExternalData(limit, offset){
        this.setState({
            tableIsLoading: true
        });

        let query = {
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

                {"name":"partners.name",         "alias": "partner_name"},

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

        if (typeof this.state.currentSortedColumn.id !== 'undefined') { // we are sorting a column
            query.sort = [{
                field: mapColumnIdToTableName[this.state.currentSortedColumn.id] || 'saved_date',
                ascending: this.state.currentSortedColumn.sortAscending
            }];
        }

        query.limit = limit;
        query.offset = offset;

        query = this.appendQueryFilters(query);
        if(this.tableDataPromise){
            this.tableDataPromise.cancel();
        }

        this.tableDataPromise = runQuery({}, query).then(data => {
            this.setState({
                data: data.data.data,
                tableIsLoading: false
            });
        });
    }

    /**
     * Filter the search given the selected filters from filter toolbar
     * @param {Object} query initial query
     */
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

    setPreviewArticle(article) {
        this.setState({ previewArticle: { data: article } });
    }

    resetPreviewArticle() {
        this.setState({ previewArticle: null });
    }

    /*
    cloneTableHeaderForPinning() {
        return;
        const original = findDOMNode(this.table);
        let table = original.querySelector('table').cloneNode(true);
        [].forEach.call(table.querySelectorAll('tbody'), el => table.removeChild(el));
        table.className = Style.stickyHeader;
        original.querySelector('.griddle-body div').appendChild(table);
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



        }

    }



    getColumns() {
        let columns = ['partner_id','article_title','site_name','fb_clicks','fb_reach','fb_ctr','fb_shared_date', 'hash'];

        return !this.isMobile ? columns : columns.filter(column => /article_title|fb_clicks|fb_reach|fb_ctr/.test(column));
    }
    */

}

const runQuery = QuerySource.runQuery().remote;

const getInfluencer = partnerId => {
    let influencer = _.find(UserStore.getState().user.influencers, {id: partnerId});
    return influencer || {};
};


const influencerComponent = ({rowData}) => {
    let influencer = getInfluencer(rowData.partner_id);

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
        <article className={Style.linkRow}>
            <img className={Style.avatar} src={influencer.fb_profile_image} />
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
        reach = numeral(rowData.fb_reach).format('0,0');
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

const columnMetadata = (context) => {

    let columns = [
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
            displayName: 'Shared',
            cssClassName: Style.sharedate,
            customComponent: sharedDateComponent,
            sortDirectionCycle: ['asc', 'desc']
        },
        {
            columnName: 'hash',
            displayName: '',
            cssClassName: Style.actions,
            customComponent: props => <LinkCellActions className={Style.showOnHover} props={props} setPreviewArticle={context.setPreviewArticle} />
        }
    ];

    return columns;
};

const columnMetadataMobile = context => [
    {
        columnName: 'article_title',
        displayName: 'Post',
        cssClassName: Style.title,
        sortDirectionCycle: ['asc', 'desc'],
        customComponent: ({rowData}) => (
            <LinkComponent
                fromNow={moment(rowData.saved_date).format('M/D/YYYY')}
                hash={rowData.hash}
                influencer={getInfluencer(rowData.partner_id).name || 'Unknown'}
                platform={Config.platforms[rowData.platform_id].name}
                site={rowData.site_name}
                shortlink={'//qklnk.co/' + rowData.hash}
                title={rowData.article_title}
            />
        )
    },
    {
        columnName: 'fb_clicks',
        displayName: 'Clicks',
        cssClassName: Style.clicks,
        customComponent: clicksComponent,
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
    }
];

const mapColumnIdToTableName = {
    partner_id: 'partners.name',
    article_title: 'articles.title',
    site_name: 'sites.name',
    post_clicks: 'post_clicks',
    fb_clicks: 'fb_posts.clicks',
    fb_reach: 'fb_posts.reach',
    fb_ctr: 'fb_posts.ctr',
    fb_shared_date: 'fb_posts.created_time'
};

export function checkIfPinned({ currentTarget }) {
    const posY = currentTarget.getBoundingClientRect().top;
    console.log('position', posY);
    if ( (posY >= 128 && this.isPinned) ||
         (posY < 128 && !this.isPinned) ) {
        this.isPinned = !this.isPinned;
        document.querySelector('div[class*="scrollpane"]').classList.toggle(Style.pinned, this.isPinned);
    }
}
