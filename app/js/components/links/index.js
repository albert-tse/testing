import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Button, Link, ProgressBar } from 'react-toolbox';
import { filter, debounce, defer, find, intersection, isEqual, map } from 'lodash';
import classnames from 'classnames';
import moment from 'moment';

import Config from '../../config';
import History from '../../history';

import LinkStore from '../../stores/Link.store';
import ListStore from '../../stores/List.store';
import UserStore from '../../stores/User.store';
import FilterStore from '../../stores/Filter.store';
import ShareDialogStore from '../../stores/ShareDialog.store';

import UserActions from '../../actions/User.action';
import LinkActions from '../../actions/Link.action';
import ListActions from '../../actions/List.action';
import FilterActions from '../../actions/Filter.action';

import { AppContent } from '../shared';
import ArticleModal from '../shared/articleModal';
import SaveButton from '../shared/article/SaveButton.component';
import LinkCellActions from '../shared/LinkCellActions';
import ArticleDialogs from '../shared/article/ArticleDialogs.component';
import LinkItem from './LinkItem.component';
import InfluencerSelector from '../influencer-selector';
import { DownloadLinksCSV } from '../toolbar/toolbar_components';
import { Toolbars } from '../toolbar';

import Style from './style';
import { linksTable } from '../analytics/table.style';
import { columns, stretch } from '../common';

/**
 * Container component for links page
 * Shows a list of shortlinks that each influencer generated
 * @return {React.Component}
 */
export default class Links extends Component {

    /**
     * Passes down props from Router component
     * @param {object} props containing route information
     * @return {Links}
     */
    constructor(props) {
        super(props);
    }

    /**
     * Load all data that this page needs such as
     *  - shortlinks that selected inlfuencer generated
     *  - all user's lists so that stories associated shortlinks
     *    can be saved there if influencer chooses to do so
     */
    componentWillMount() {
        LinkActions.fetchLinks();
        ListActions.getSavedList();
        ListActions.loadMyLists();
    }

    render() {
        return (
            <AltContainer
                component={Contained}
                store={LinkStore}
                transform={props => {
                    return {
                        ...props,
                        filters: FilterStore.getState(),
                    };
                }}
            />
        );
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
    influencerAvatar: 'https://tse-media.s3.amazonaws.com/img/211',
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
            this.state !== nextState ||
            this.props.isScheduling !== nextProps.isScheduling;

        return shouldUpdate;
    }

    componentDidUpdate(nextProps, nextState) {
        // Close article modal when article is scheduled/shared
        if (this.props.isScheduling !== nextProps.isScheduling) {
            this.setState({ previewArticle: null });
        }
    }

    render() {
        let linksToolbar = UserStore.getState().isSchedulingEnabled ? <Toolbars.LinksScheduling /> : <Toolbars.Links />;

        return (
            <div className={columns}>
                <InfluencerSelector isPinned={true} />
                <AppContent id="Links" className={stretch}>
                    {linksToolbar}
                    {this.props.showEnableSchedulingCTA && (
                        <div className={Style.enableScheduling}>
                            <h2>Do you want to schedule posts?</h2>
                            <Button raised accent label="Enable Scheduling" onClick={History.push.bind(null, Config.routes.manageAccounts)} />
                        </div>
                    )}
                    {this.renderContent(this.props.links)}
                    <ArticleDialogs fullscreen previewArticle={this.state.previewArticle} resetPreviewArticle={this.resetPreviewArticle}/>
                </AppContent>
            </div>
        );
    }

    renderContent(links) {
        if (links < 0) { // it must be loading
            return (
                <div className={Style.loadingContainer}>
                    <ProgressBar type="circular" mode="indeterminate" />
                </div>
            );
        } else if (links.length > 0) {
            return this.renderLinksTable(links);
        } else {
            return <div className="alert alert-info" style={{ margin: '2rem' }}><span>We did not find any links within your search criteria.</span></div>;
        }
    }

    renderLinksTable(links) {
        return (
            <div className={Style.linksTableContainer}>
                <div className={Style.bottomSection}>
                    {links.map((link, index) => {
                        return (
                            <LinkItem
                                key={index}
                                link={link}
                                showInfo={this.setPreviewArticle}
                            />
                        );
                    })}
                </div>
                <div className={Style.pagingNav}>
                    {this.renderBackButton()}
                    {this.renderNextButton()}
                </div>
            </div>
        );
    }

    renderBackButton() {
        if (this.props.filters.linksPageNumber !== 0) {
            return (
                <Button label='Back' onClick={this.clickBack} />
                );
        } else {
            return false;
        }
    }

    renderNextButton() {
        if (this.props.links.length === this.props.filters.linksPageSize) {
            return (
                <Button label='Next' onClick={this.clickNext} />
            );
        }
    }

    clickBack() {
        if (this.props.filters.linksPageNumber > 0) {
            FilterActions.update({ linksPageNumber: this.props.filters.linksPageNumber - 1 });
        }
    }

    clickNext() {
        if (this.props.links.length === this.props.filters.linksPageSize) {
            FilterActions.update({ linksPageNumber: this.props.filters.linksPageNumber + 1 });
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
