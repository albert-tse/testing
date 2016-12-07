import React, { Component } from 'react';
import Griddle from 'griddle-react';
import { checkIfPinned } from './table.component';
import ArticleModal from '../shared/articleModal';
import LinkCellActions from '../shared/LinkCellActions';

import { isMobilePhone } from '../../utils';

import { influencer } from './table.style';
import Style, { accounting, linkComponent, linksTable, stickyHeader } from './table.style';

import classnames from 'classnames';
import numeral from 'numeral';

export default class AccountingTable extends Component {

    constructor(props) {
        super(props);
        this.isPinned = false;
        this.setPreviewArticle = this.props.setPreviewArticle;
    }

    render() {
        const isMobile = isMobilePhone();

        return (
            <div className="griddle-container">
                <div className="griddle-body">
                    <div onWheel={checkIfPinned.bind(this)}>
                        <table className={classnames(linksTable, accounting)}>
                            <thead>
                                <tr>
                                    <th>My Top Earning Links</th>
                                    <th>Revenue</th>
                                    {!isMobile && <th>Clicks</th>}
                                    <th>Reach</th>
                                    <th>CTR</th>
                                    {!isMobile && <th />}
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
                                        <td>{link.revenue}{isMobile && <p>({link.credited_clicks})</p>}</td>
                                        {!isMobile && <td>{link.credited_clicks}</td>}
                                        <td>{link.reach}</td>
                                        <td>{link.ctr}%</td>
                                        {!isMobile && <td><LinkCellActions className={Style.showOnHover} props={{rowData: link}} setPreviewArticle={this.setPreviewArticle} /></td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table className={classnames(linksTable, accounting, stickyHeader)}>
                            <thead>
                                <tr>
                                    <th>My Top Earning Links</th>
                                    <th>Revenue</th>
                                    {!isMobile && <th>Clicks</th>}
                                    <th>Reach</th>
                                    <th>CTR</th>
                                    {!isMobile && <th></th>}
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        );
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
