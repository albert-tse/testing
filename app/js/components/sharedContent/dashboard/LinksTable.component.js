import React from 'react';
import AltContainer from 'alt-container';
import InfluencerStore from '../../../stores/Influencer.store';
import {widget, widgetWrapper} from './style';
import Griddle from 'griddle-react';
import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import { title } from './style';

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
        links = _.map(links, _.partial(_.pick, _, 'title', 'site_name', 'total_clicks', 'fb_reach', 'ctr', 'cpc', 'shared_date', 'ucid', 'fb_permalink'));

        return (
            <Griddle results={links} columnMetadata={columnMetadata} />
        );

    }
}

const columnMetadata = [
    {
        columnName: 'title',
        displayName: 'Title',
        cssClassName: title
    },
    {
        columnName: 'site_name',
        displayName: 'Site'
    },
    {
        columnName: 'total_clicks',
        displayName: 'Clicks',
        customComponent: ({ data }) => <span>{data > 999 ? numeral(data).format('0.00a') : data}</span>
    },
    {
        columnName: 'fb_reach',
        displayName: 'Reach',
        customComponent: ({ data }) => <span>{data > 0 ? numeral(data).format('0.00a') : '0'}</span>
    },
    {
        columnName: 'ctr',
        displayName: 'CTR'
    },
    {
        columnName: 'cpc',
        displayName: 'CPC'
    },
    {
        columnName: 'shared_date',
        displayName: 'Published',
        customComponent: ({ data }) => <div>{data > 0 ? moment(data).format('D MMM YYYY') : 'Not Published'}</div>
    },
    {
        columnName: 'ucid',
        displayName: 'Article'
    },
    {
        columnName: 'fb_permalink',
        displayName: 'Permalink',
        customComponent: ({ data }) => <div>{data.length > 0 ? data : 'Not Found'}</div>
    }
];
