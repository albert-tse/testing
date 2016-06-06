import React from 'react';
import Config from '../../config'
import { Tab, Tabs } from 'react-toolbox';
import FontIcon from 'react-toolbox/lib/font_icon';
import Dashboard from './dashboard/Dashboard.component';
import SharedLinks from './sharedLinks/SharedLinks.component';
import Styles from './style'

class SharedContent extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        index: 0
    }

    handleTabChange(index) {
        this.setState({ index });
    }

    generateFilterBarFilters(data) {
        var platforms = _.keys(_.groupBy(data, 'platform_id'));
        platforms = _.map(platforms, function (el) {
            var platform = Config.platforms[el];
            return {
                caption: platform.name,
                count: _.filter(data, { 'platform_id': platform.id }).length,
                id: platform.id,
                disabled: false
            };
        }.bind(this));

        //Scan the filtered data, and get a list of sites for the filter bar
        var sites = _.groupBy(data, 'site_id');
        sites = _.map(sites, function (el) {
            var first = el[0];
            return {
                caption: first.site_name,
                count: el.length,
                id: first.site_id,
                disabled: false
            };
        });

        var filters = [{
            caption: 'Platforms',
            id: 1,
            filters: platforms
        }, {
            caption: 'Sites',
            id: 2,
            filters: sites
        }];

        return filters;
    }

    render() {
        var links = [];
        if (this.props.linkData && this.props.linkData.links) {
            links = this.props.linkData.links;
        }

        var filters = this.generateFilterBarFilters(links);

        return (
            <Tabs index={this.state.index} onChange={::this.handleTabChange} className={Styles.tabs}>
                <Tab label='Dashboard'><Dashboard 
                        links={ this.props.linkData }
                        clicks={ this.props.clickData }
                        dataModel = { this.props.dataModel }
                    />
                </Tab>
                <Tab label='Shared Links'>
                    <SharedLinks 
                        links={ links }
                        dataModel = { this.props.dataModel }
                    />
                </Tab>
            </Tabs>
        );
    }
}

export default SharedContent;
