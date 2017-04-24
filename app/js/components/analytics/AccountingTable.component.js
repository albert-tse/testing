import React, { Component } from 'react';
import Griddle, { plugins, ColumnDefinition, RowDefinition } from 'griddle-react';
import { connect }  from 'react-redux';

import { checkIfPinned } from './table.component';
import LinkComponent from './Link.component';
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
        this.setPreviewArticle = this.props.setPreviewArticle;
    }

    render() {
        const isMobile = isMobilePhone();
        return (
            <Griddle
                data={this.props.links}
                plugins={[plugins.LocalPlugin]}>
                <RowDefinition>
                    <ColumnDefinition
                        id="site_name"
                        title="My Top Earning Links"
                        customComponent={enhancedWithRowData(LinkComponent)}
                    />
                    <ColumnDefinition
                        id="revenueVal"
                        title="Revenue"
                        customComponent={({value}) => (
                            <span>{numeral(value).format('$0,0.00')}</span>
                        )}
                    />
                </RowDefinition>
            </Griddle>
        );

        /*(
            <div className="griddle-container">
                <div className="griddle-body">
                    <div>
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
                                    <tr key={index} onClick={this.setPreviewArticle.bind(this, link)}>
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
        );*/
    }
}

const rowDataSelector = (state, { griddleKey }) => {
    return state
        .get('data')
        .find(rowMap => rowMap.get('griddleKey') === griddleKey)
        .toJSON();
};

const enhancedWithRowData = connect((state, props) => {
    return {
        rowData: rowDataSelector(state, props)
    };
});
