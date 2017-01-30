import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Button, Link, ProgressBar } from 'react-toolbox';

import LinkStore from '../../stores/Link.store';
import ListStore from '../../stores/List.store';
import UserStore from '../../stores/User.store';
import FilterStore from '../../stores/Filter.store';

import UserActions from '../../actions/User.action';
import LinkActions from '../../actions/Link.action';
import ListActions from '../../actions/List.action';
import FilterActions from '../../actions/Filter.action';

import { AppContent, ArticleView } from '../shared';
import { Toolbars } from '../toolbar';
import Style from './style';
import ArticleModal from '../shared/articleModal';
import { linksTable } from '../analytics/table.style';
import SaveButton from '../shared/article/SaveButton.component';
import LinkCellActions from '../shared/LinkCellActions';
import ArticleDialogs from '../shared/article/ArticleDialogs.component';

import classnames from 'classnames';
import moment from 'moment';
import { debounce, defer } from 'lodash';
import Griddle from 'griddle-react';

export default class Links extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        LinkActions.fetchLinks();
        ListActions.getSavedList();
        ListActions.loadMyLists();
    }

    componentDidMount() {
        FilterStore.listen(::this.onFilterChange);
        UserStore.listen(::this.onFilterChange);
    }

    componentWillUnmount() {
        FilterStore.unlisten(::this.onFilterChange);
        UserStore.unlisten(::this.onFilterChange);
    }

    render() {
        return (
            <AltContainer
                component={Contained}
                stores={{
                    links: props => ({
                        store: LinkStore,
                        value: this.mergeSavedState(LinkStore.getState().searchResults)
                    })
                }}
            />
        );
    }
    
    onFilterChange() {
        _.defer(LinkActions.fetchLinks);
        return true;
    }

    mergeSavedState(links) {
        if (Array.isArray(links)) {
            const savedArticles = ListStore.getSavedList();
            const ucidsOfSavedArticles = Array.isArray(savedArticles.articles) ? savedArticles.articles.map(article => article.ucid) : [];
            return links.map(link => Object.assign(link, {
                isSaved: ucidsOfSavedArticles.indexOf(link.ucid) >= 0
            }));
        } else {
            return [];
        }
    }

}

/*

Example of new link object

{
    linkId: 188643,
    longUrl: 'http://rare.us/story/when-a-woman-tried-to-pet-a-wild-bison',
    shortUrl: 'http://po.st/Um2xtK',
    hash: 'Um2xtK',
    ucid: 889646,
    articleTitle: 'When a woman tried to pet a wild bison, visitors pulled out their phones and screamed "OMG!"',
    articleImage: 'https://tse-media.s3.amazonaws.com/img/889646',
    articleDescription: 'Petting wild bison is completely forbidden at Yellowstone National Park.',
    articlePublishedDate: '2016-04-21 18:58:18',
    influencerId: 4,
    influencerName: 'Brad Takei',
    platformId: 2,
    platformName: 'Facebook',
    userId: 26,
    siteId: 3427,
    publisherId: 79,
    savedDate: '2017-01-21 21:13:40',
    sharedDate: null,
    scheduledTime: null,
    postedTime: null,
    sortDate: '2017-01-21 21:13:40',
    guid: '79c679f0e01e11e6a03c354c456e1db2' 
}


 */

class Contained extends Component {

    constructor(props) {
        super(props);
        this.setPreviewArticle = this.setPreviewArticle.bind(this);
        this.resetPreviewArticle = this.resetPreviewArticle.bind(this);
        this.state = {
            previewArticle: null,
        };
    }

    render() {
        return (
            <div>
                <Toolbars.Links />
                <AppContent id="Links">
                    {this.renderContent(this.props.links)}
                    <ArticleDialogs previewArticle={this.state.previewArticle} resetPreviewArticle={this.resetPreviewArticle}/>
                </AppContent>
            </div>
        );
    }

    renderContent(links) {
        if (!Array.isArray(links)) { // it must be loading
            return <ProgressBar type="circular" mode="indeterminate" />;
        } else if (links.length > 0) {
            return this.renderLinksTable(links);
        } else {
            return <div className="alert alert-info" style={{ margin: '2rem' }}><span>We did not find any links within your search criteria.</span></div>;
        }
    }

    renderLinksTable(links) {
        let tableData = links.map(link => ({
            id: link.linkId,
            title: link.articleTitle,
            saved_date: link.savedDate,
            shortlink: link.shortUrl
        }));

        return (
            <div className={Style.linksTableContainer}>
                <Griddle
                    tableClassName={linksTable}
                    useGriddleStyles={false}
                    results={links}
                    columns={["articleTitle", "shortUrl", "savedDate", "hash"]}
                    columnMetadata={Links.columnsMetaData(this)}
                    resultsPerPage={25}
                />
            </div>
        );
    }

    setPreviewArticle(link) {
        let article = {
            data: { ucid: link.ucid }
        };

        this.setState({ previewArticle: article });
    }

    resetPreviewArticle() {
        this.setState({ previewArticle: null });
    }

}

class LinkCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Link href={this.props.data} target="_blank" className={Style.link}>{this.props.data}</Link>
        );
    }
}

class DateCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let displayDate = moment(this.props.data).format("MMM D, YY h:mm a");
        
        return (
            <span>{displayDate}</span>
        );
    }
}

class TitleCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={Style.title}>
                <img src={this.props.rowData.articleImage} />
                {this.props.data}
            </div>
        );
    }
}

Links.columnsMetaData = context => [{
    columnName: "savedDate",
    order: 0,
    locked: false,
    visible: true,
    displayName: "Saved Date",
    customComponent: DateCell
}, {
    columnName: "articleTitle",
    order: 1,
    locked: false,
    visible: true,
    displayName: "Title",
    customComponent: TitleCell
}, {
    columnName: "shortUrl",
    order: 2,
    locked: false,
    visible: true,
    displayName: "URL",
    customComponent: LinkCell
}, {
    columnName: "hash",
    order: 3,
    locked: false,
    visible: true,
    displayName: "",
    customComponent: props => <LinkCellActions props={props} setPreviewArticle={context.setPreviewArticle} />
}];
