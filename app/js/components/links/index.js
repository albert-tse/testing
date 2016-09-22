import React from 'react';
import moment from 'moment';
import AltContainer from 'alt-container';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Link from 'react-toolbox/lib/link';
import { AppContent, ArticleView } from '../shared';
import LinkStore from '../../stores/Link.store'
import LinkActions from '../../actions/Link.action'
import UserStore from '../../stores/User.store'
import UserActions from '../../actions/User.action'
import FilterStore from '../../stores/Filter.store'
import FilterActions from '../../actions/Filter.action'
import { Toolbars } from '../toolbar';
import debounce from 'lodash/debounce';
import defer from 'lodash/defer';
import Griddle from 'griddle-react';
import Style from './style';
import { linksTable } from '../analytics/table.style';

export default class Links extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        LinkActions.fetchLinks();
    }

    componentDidMount() {
        FilterStore.listen(::this.onFilterChange);
        UserStore.listen(::this.onFilterChange);
    }

    componentWillUnmount() {
        FilterStore.unlisten(::this.onFilterChange);
        UserStore.unlisten(::this.onFilterChange);
    }

    render() {
        return ( 
            <AltContainer 
                render={::this.renderComponent}
                shouldComponentUpdate={
                    (prevProps, container, nextProps) => prevProps.links !== nextProps.links
                }
                stores={
                    {
                        links: props => ({
                            store: LinkStore,
                            value: LinkStore.getState().searchResults
                        })
                    }
                }
            />
        );
    }

    renderComponent(props) {
        return (
            <div>
                <Toolbars.Links />
                <AppContent id="Links">
                    {this.renderContent(props.links)}
                </AppContent>
            </div>
        );
    }

    renderContent(links) {
        if (!Array.isArray(links)) { // it must be loading
            return <ProgressBar type="circular" mode="indeterminate" />;
        } else if (links.length > 0) {
            return this.renderLinksTable(links)
        } else {
            return <div className="alert alert-info" style={{ margin: '2rem' }}><span>We did not find any links within your search criteria.</span></div>;
        }
    }

    onFilterChange() {
        _.defer(LinkActions.fetchLinks);
        return true;
    }

    renderLinksTable(links) {
        let tableData = _.map(links, function (link) {
            return {
                id: link.id,
                title: link.title,
                saved_date: link.saved_date,
                shortlink: link.shortlink
            };
        });

        let columns = [{
            "columnName": "title",
            "order": 0,
            "locked": false,
            "visible": true,
            "displayName": "Title"
        }, {
            "columnName": "shortlink",
            "order": 1,
            "locked": false,
            "visible": true,
            "displayName": "Link",
            "customComponent": LinkCell
        }, {
            "columnName": "saved_date",
            "order": 2,
            "locked": false,
            "visible": true,
            "displayName": "Saved Date",
            "customComponent": DateCell
        }, ]

        return (
            <div className={Style.linksTableContainer}>
                <Griddle
                    tableClassName={linksTable}
                    useGriddleStyles={false}
                    results={links}
                    columns={["title", "shortlink", "saved_date"]}
                    columnMetadata={columns}
                    resultsPerPage={25}
                />
            </div>
        );
    }

}

class LinkCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Link href={this.props.data} target="_blank" icon='open_in_new' className={ Style.link }>{this.props.data}</Link>
        )
    }
}

class DateCell extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let displayDate = moment(this.props.data).format("MMM Do YYYY, h:mm:ss a");
        
        return (
            <span>{displayDate}</span>
        );
    }
}
