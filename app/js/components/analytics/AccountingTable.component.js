import React, { Component } from 'react';
import Griddle from 'griddle-react';
import { checkIfPinned } from './table.component';
import ArticleModal from '../shared/articleModal';
import LinkCellActions from '../shared/LinkCellActions';

import { influencer } from './table.style';
import Style, { accounting, linkComponent, linksTable, stickyHeader } from './table.style';

import classnames from 'classnames';
import numeral from 'numeral';

export default class AccountingTable extends Component {

    constructor(props) {
        super(props);
        this.isPinned = false;
        this.state = {
            infoArticle: null,
            showArticleModal: false
        };
    }

    render() {
        return (
            <div class="griddle-container">
                <div class="griddle-body">
                    <div onWheel={checkIfPinned.bind(this)}>
                        <table className={classnames(linksTable, accounting)}>
                            <thead>
                                <tr>
                                    <th>My Top Earning Links</th>
                                    <th>Revenue</th>
                                    <th>Clicks</th>
                                    <th>Reach</th>
                                    <th>CTR</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.links.map((link, index) => (
                                    <tr key={index}>
                                        <td>
                                            <LinkComponent
                                                fromNow={link.fromNow}
                                                hash={link.hash}
                                                platform={link.platform_name}
                                                shortlink={link.shortlink}
                                                site={link.site_name}
                                                title={link.title}
                                                influencer={link.influencer_name}
                                            />
                                        </td>
                                        <td>{link.revenue}</td>
                                        <td>{link.credited_clicks}</td>
                                        <td>{link.reach}</td>
                                        <td>{link.ctr}%</td>
                                        <td><LinkCellActions className={Style.showOnHover} props={{rowData: link}} context={this} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table className={classnames(linksTable, accounting, stickyHeader)}>
                            <thead>
                                <tr>
                                    <th>My Top Earning Links</th>
                                    <th>Revenue</th>
                                    <th>Clicks</th>
                                    <th>Reach</th>
                                    <th>CTR</th>
                                    <th></th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
                <ArticleModal article={this.state.infoArticle} visible={this.state.showArticleModal} hide={::this.hideArticleModal}/>
            </div>
        );
    }

    hideArticleModal() {
        this.setState({ showArticleModal: false });
    }
}

class LinkComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { fromNow, hash, platform, influencer, shortlink, site, title } = this.props;

        return (
            <div className={linkComponent}>
                <small>{site} &bull; <a href={shortlink} target="_blank">{'qklnk.co/' + hash}</a></small>
                <header>{title}</header>
                <footer>
                    {fromNow} by {influencer} on {platform}
                </footer>
            </div>
        );
    }
}
