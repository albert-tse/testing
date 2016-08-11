import React from 'react';
import AltContainer from 'alt-container';
import InfluencerStore from '../../../stores/Influencer.store';
import {widget, widgetWrapper} from './style';
import Griddle from 'griddle-react';
import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import { avatar, headline, title, linkTable, linkRow, metadata, sortable, siteName } from './style';

export default class Component extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { links } = this.props;

        return (
            <div className={linkTable}>
                <Griddle
                    bodyHeight={480}
                    columns={['title', 'total_clicks', 'fb_reach', 'ctr', 'cpc']}
                    columnMetadata={columnMetadata}
                    results={links}
                    resultsPerPage={25}
                    enableInfiniteScroll={true}
                    useFixedLayout={false}
                    useFixedHeader={true}
                />
            </div>
        );

    }
}

const article = ({rowData}) => {
    return (
        <article className={linkRow}>
            <img className={avatar} src={rowData.influencer.fb_profile_image} />
            <section className={headline}>
                <p className={siteName}>{rowData.site_name}</p>
                {rowData.title}
                <footer className={metadata}>
                    {rowData.influencer.name} - {rowData.platform.name} - {rowData.shared_date > 0 ? moment(rowData.shared_date).fromNow() : 'Not Shared'}
                </footer>
            </section>
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
