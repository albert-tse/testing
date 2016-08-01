import React from 'react';
import AltContainer from 'alt-container';
import InfluencerStore from '../../../stores/Influencer.store';
import {widget, widgetWrapper} from './style';
import Griddle from 'griddle-react';
import _ from 'lodash';
import numeral from 'numeral';

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
        console.log(links);
        return (
            <Griddle results={links} columnMetadata={columnMetadata} />
        );

    }
}

const columnMetadata = [
    {
        columnName: 'title',
        displayName: 'Title'
    },
    {
        columnName: 'site_name',
        displayName: 'Site'
    },
    {
        columnName: 'total_clicks',
        displayName: 'Clicks',
        customComponent: ({ data }) => <span>{numeral(data).format('0.00a')}</span>
    },
    {
        columnName: 'fb_reach',
        displayName: 'Reach',
        customComponent: ({ data }) => <span>{data > 0 ? numeral(data).format('0.00a') : 'N/A'}</span>
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
        displayName: 'Published'
    },
    {
        columnName: 'ucid',
        displayName: 'Article'
    },
    {
        columnName: 'fb_permalink',
        displayName: 'Permalink'
    }
];
