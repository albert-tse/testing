import React from 'react';
import AltContainer from 'alt-container';
import InfluencerStore from '../../../stores/Influencer.store';
import {widget, widgetWrapper} from './style';
import Griddle from 'griddle-react';
import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import { headline, title, linkTable, linkRow, metadata, sortable, siteName } from './style';

export default class LinksTable extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                store={InfluencerStore}
                component={Component}
                transform={props => ({ links: props.searchedLinkTotals.links }) }
            />
        );
    }

}

class Component extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { links } = this.props;

        return (
            <div className={linkTable}>
                <Griddle
                    columns={['title', 'total_clicks', 'fb_reach', 'ctr', 'cpc']}
                    columnMetadata={columnMetadata}
                    results={links}
                    resultsPerPage={50}
                />
            </div>
        );

    }
}

const article = ({rowData}) => {
    return (
        <article className={linkRow}>
            <header className={headline}>
                <p className={siteName}>{rowData.site_name}</p>
                {rowData.title}
            </header>
            <small className={metadata}>
                {rowData.influencer.name} - {rowData.platform.name} - {rowData.shared_date > 0 ? moment(rowData.shared_date).timeAgo() : 'Not Shared'}
            </small>
        </article>
    );
};

const columnMetadata = [
    {
        columnName: 'title',
        displayName: '',
        sortable: false,
        cssClassName: title,
        customComponent: article
    },
    {
        columnName: 'total_clicks',
        displayName: 'Clicks',
        customComponent: ({ data }) => <span>{data > 999 ? numeral(data).format('0.00a') : data}</span>,
        cssClassName: sortable
    },
    {
        columnName: 'fb_reach',
        displayName: 'Reach',
        customComponent: ({ data }) => <span>{data > 0 ? numeral(data).format('0.00a') : '0'}</span>,
        cssClassName: sortable
    },
    {
        columnName: 'ctr',
        displayName: 'CTR',
        cssClassName: sortable
    },
    {
        columnName: 'cpc',
        displayName: 'CPC',
        cssClassName: sortable
    }
];
