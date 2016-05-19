import React from 'react'
import { Table, Column, Cell } from 'fixed-data-table';

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
        total_clicks: {
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
        cost: {
            type: Number,
            title: 'Revenue'
        },
        saved_date: {
            type: Date,
            title: 'Saved'
        },
        published_at: {
            type: Date,
            title: 'Published'
        },

    }

    render() {
        return (
            <Table
                rowHeight={50}
                rowsCount={this.props.links.length}
                width={7000}
                height={((this.props.links.length+1) * 50) + 2}
                headerHeight={50}>
                <Column
                  header={<Cell>Title</Cell>}
                  cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                        {this.props.links[rowIndex].title}
                    </Cell>
                  )}
                  width={300}
                />
                <Column
                  header={<Cell>Site</Cell>}
                  cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                        {this.props.links[rowIndex].site_name}
                    </Cell>
                  )}
                  width={200}
                />
                <Column
                  header={<Cell>URL</Cell>}
                  cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                        {this.props.links[rowIndex].shortlink}
                    </Cell>
                  )}
                  width={200}
                />
                <Column
                  header={<Cell>Clicks</Cell>}
                  cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                        {this.props.links[rowIndex].total_clicks}
                    </Cell>
                  )}
                  width={200}
                />
                <Column
                  header={<Cell>Reach</Cell>}
                  cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                        {this.props.links[rowIndex].fb_reach}
                    </Cell>
                  )}
                  width={200}
                />
                <Column
                  header={<Cell>CTR</Cell>}
                  cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                        {this.props.links[rowIndex].ctr}
                    </Cell>
                  )}
                  width={200}
                />
                <Column
                  header={<Cell>CPC</Cell>}
                  cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                        {this.props.links[rowIndex].cpc}
                    </Cell>
                  )}
                  width={200}
                />
                <Column
                  header={<Cell>Saved</Cell>}
                  cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                        {this.props.links[rowIndex].saved_date}
                    </Cell>
                  )}
                  width={200}
                />
                <Column
                  header={<Cell>Published</Cell>}
                  cell={({rowIndex, ...props}) => (
                    <Cell {...props}>
                        {this.props.links[rowIndex].fb_reach}
                    </Cell>
                  )}
                  width={200}
                />
              </Table>
        );
    }
}

export default SharedLinks;
