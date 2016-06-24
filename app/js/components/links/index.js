import React from 'react';
import moment from 'moment';
import AltContainer from 'alt-container';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Table from 'react-toolbox/lib/table';
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
var Toolbar = Toolbars.Links;

const DataModel = {
    title: { type: String },
    shortlink: { type: String },
    savedDate: { type: Date }
};

class Links extends React.Component {

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
                shouldComponentUpdate={ (prevProps, container, nextProps) => prevProps.links !== nextProps.links }
                stores={{
                    links: props => ({
                        store: LinkStore,
                        value: LinkStore.getState().searchResults
                    })
                }}
            />
        );
    }

    renderComponent(props) {
        return (
            <div>
                <Toolbar />
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
        return debounce(() => defer(LinkActions.fetchLinks), 500);
    }


    renderLinksTable(links) {
        links = _.map(links, function (el) {
            el.savedDate = moment(el.saved_date).toDate();
            return el;
        });
        return (
            <Table
                selectable={false}
                model={DataModel}
                source={links}
              />
        );
    }

}

export default Links;
