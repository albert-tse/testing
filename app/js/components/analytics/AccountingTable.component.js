import React, { Component } from 'react';
import { influencer } from './table.style';
import numeral from 'numeral';
import Griddle from 'griddle-react';
import { linksTable, linkComponent } from './styles';
import classnames from 'classnames';
import { pinned, stickyHeader } from './table.style';
import { checkIfPinned } from './table.component';

export default class AccountingTable extends Component {
    constructor(props) {
        super(props);
        this.isPinned = false;
    }

    render() {
        return (
            <div onWheel={checkIfPinned.bind(this)}>
                <table className={linksTable}>
                    <thead>
                        <tr>
                            <th>My Top Earning Links</th>
                            <th>Revenue</th>
                            <th>Clicks</th>
                            <th>Reach</th>
                            <th>CTR</th>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
                <table className={classnames(linksTable, stickyHeader)}>
                    <thead>
                        <tr>
                            <th>My Top Earning Links</th>
                            <th>Revenue</th>
                            <th>Clicks</th>
                            <th>Reach</th>
                            <th>CTR</th>
                        </tr>
                    </thead>
                </table>
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
