import React from 'react'
import Table from 'react-toolbox/lib/table'

class SharedLinks extends React.Component {

    constructor(props) {
        super(props);
    }

    dataModel = {
        title: {
            type: String,
            title: 'Title'
        },
        site_name: {
            type: String,
            title: 'Site'
        },
        shortlink: {
            type: String,
            title: 'URL'
        },
        clicks: {
            type: Number,
            title: 'Clicks'
        },
        fb_reach: {
            type: Number,
            title: 'Reach'
        },
        ctr: {
            type: Number,
            title: 'CTR'
        },
        cpc: {
            type: Number,
            title: 'CPC'
        },
        revenue: {
            type: Number,
            title: 'Revenue'
        },
        saved_date: {
            type: String,
            title: 'Saved'
        },
        published_at: {
            type: Number,
            title: 'Published At'
        },

    }

    render() {
        return (
            <Table
		        model = { this.dataModel }
				selectable = { false }
				source = { this.props.links }
			/>
        );
    }
}

export default SharedLinks;
