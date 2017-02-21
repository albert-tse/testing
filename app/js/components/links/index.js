import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Button, Link, ProgressBar } from 'react-toolbox';
import { filter, debounce, defer, find, intersection, isEqual, map } from 'lodash';
import classnames from 'classnames';
import moment from 'moment';

import Config from '../../config';

import LinkStore from '../../stores/Link.store';
import ListStore from '../../stores/List.store';
import UserStore from '../../stores/User.store';
import FilterStore from '../../stores/Filter.store';
import ProfileStore from '../../stores/Profile.store';

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
import LinkItem from './LinkItem.component';

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
                store={LinkStore}
                transform={ props => ({
                    links: this.mergeSavedState(props.searchResults),
                    profiles: ProfileStore.getState().profiles,
                    influencers: UserStore.getState().user.influencers
                })}
            />
        );
    }
    
    onFilterChange() {
        defer(LinkActions.fetchLinks);
        return true;
    }

    mergeSavedState(links) {
        if (Array.isArray(links)) {
            const savedArticles = ListStore.getSavedList();
            const ucidsOfSavedArticles = Array.isArray(savedArticles.articles) ? savedArticles.articles.map(article => article.ucid) : [];
            return links.map(link => ({
                ...link,
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
        this.renderNextButton = this.renderNextButton.bind(this);
        this.renderBackButton = this.renderBackButton.bind(this);
        this.clickBack = this.clickBack.bind(this);
        this.clickNext = this.clickNext.bind(this);
        this.state = {
            previewArticle: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const shouldUpdate = !isEqual(this.props.links, nextProps.links) ||
            this.props.profiles !== nextProps.profiles ||
            this.props.influencers !== nextProps.influencers ||
            this.state !== nextState;
        return shouldUpdate;
    }

    render() {
        let linksToolbar = UserStore.getState().isSchedulingEnabled ? <Toolbars.LinksScheduling /> : <Toolbars.Links />;

        return (
            <div>
                {linksToolbar}
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
        const linkedProfiles = map(ProfileStore.getState().profiles, 'id');
        const topSectionLinks = filter(links, link => link.scheduledTime && !(link.sharedDate || link.postedTime) && linkedProfiles.indexOf(link.profileId) > 0);
        const bottomSectionLinks = filter(links, link => !link.scheduledTime || link.sharedDate || link.postedTime);

        const topSection = topSectionLinks.map((link, index) => (
            <LinkItem
                className={Style.linkItem}
                key={index}
                link={link}
                profile={find(this.props.profiles, { id: link.profileId })}
                influencer={find(this.props.influencers, { id: link.influencerId })}
                showInfo={this.setPreviewArticle}
            />)
        );

        const bottomSection = bottomSectionLinks.map((link, index) => (
            <LinkItem
                key={index}
                link={link}
                profile={find(this.props.profiles, { id: link.profileId })}
                influencer={find(this.props.influencers, { id: link.influencerId })}
                showInfo={this.setPreviewArticle}
            />)
        );

        return (
            <div className={Style.linksTableContainer}>
                <div className={Style.topSection}>
                    {topSection}
                </div>
                <div className={Style.sectionDivider} />
                <div className={Style.bottomSection}>
                    {bottomSection}
                </div>
                <div className={Style.pagingNav}>
                    {this.renderBackButton()}
                    {this.renderNextButton()}
                </div>
            </div>
        );
    }

    renderBackButton() {
        if (FilterStore.getState().linksPageNumber !== 0) {
            return (
                <Button label='Back' onClick={this.clickBack} />
                );
        } else {
            return false;
        }
    }

    renderNextButton() {
        if (this.props.links.length === FilterStore.getState().linksPageSize) {
            return (
                <Button label='Next' onClick={this.clickNext} />
            );
        }
    }

    clickBack() {
        let filters = FilterStore.getState();

        if (filters.linksPageNumber > 0) {
            FilterActions.update({ linksPageNumber: filters.linksPageNumber - 1 });
        }
    }

    clickNext() {
        let filters = FilterStore.getState();

        if (this.props.links.length === filters.linksPageSize) {
            FilterActions.update({ linksPageNumber: filters.linksPageNumber + 1 });
        }
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
