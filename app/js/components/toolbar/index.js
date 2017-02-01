import React from 'react';
import { Button } from 'react-toolbox';
import Toolbar from './Toolbar.component';
import SearchActions from '../../actions/Search.action';
import InfluencerStore from '../../stores/Influencer.store';
import InfluencerActions from '../../actions/Influencer.action';
import defer from 'lodash/defer';
import Styles from './styles';
import classnames from 'classnames';
import InfluencerSwitcher from '../app/AppBar/InfluencerSwitcher.component';
import { ArticleSorter,
    BatchSaveLinks,
    ClearSelectionButton,
    AnalyticsDateRangeFilter,
    DownloadCSV,
    ExploreDateRangeFilter,
    InfluencerFilter,
    Keywords,
    MonthSelector,
    MultiSelectListDropdown,
    PlatformFilter,
    SaveArticles,
    SharePermalinkButton,
    SitesFilter,
    UsedSitesFilter,
    TopicFilter,
    AnalyticsMenu,
    RemoveFromListButton,
    LinkStateSelector,
    LinksDateRangeFilter
} from './toolbar_components';
import AddToListButton from '../shared/article/AddToListButton.component'

const createToolbar = function (props) {

    return React.createClass({
        render: function () {
            return (
                <div className={Styles.responsiveToolbar}>
                    <Toolbar {...props} />
                </div>
            );
        }
    });
};

exports.ToolbarSpecs = {
    Selection: {
        className: Styles.selectionToolbar,
        left: <ClearSelectionButton />, // This will be a component that has an IconButton to clear the selection
        right: [
            <SaveArticles key="0" />,
            <AddToListButton key="1" ucid={-1}/>,
            <SharePermalinkButton key="2" />,
            <BatchSaveLinks key="3" />
        ]
    },

    ListSelection: {
        className: Styles.selectionToolbar,
        left: <ClearSelectionButton />, // This will be a component that has an IconButton to clear the selection
        right: [
            <SaveArticles key="0" />,
            <RemoveFromListButton key="1"/>,
            <AddToListButton key="2" ucid={-1}/>,
            <SharePermalinkButton key="3" />,
            <BatchSaveLinks key="4" />
        ]
    },

    SelectionOnSaved: {
        className: Styles.selectionToolbar,
        left: <ClearSelectionButton />, // This will be a component that has an IconButton to clear the selection
        right: [
            <SaveArticles key="0" label="Remove From My Posts" />,
            <AddToListButton key="3" ucid={-1}/>,
            <SharePermalinkButton key="1" />,
            <BatchSaveLinks key="2" />
        ]
    },

    Filter: {
        mobileCollapse: false, // TODO: add new component for filters
        className: classnames(Styles.filterToolbar, Styles.desktopToolbar),
        mobileTitle: 'Filter',
        flat: true,
        left: [
            <InfluencerSwitcher key="0" />,
            <ArticleSorter key="1" />,
            <ExploreDateRangeFilter key="2" />,
            <SitesFilter key="3" />
        ],
        right: [
            <Keywords key="0" />
        ]
    },

    ListFilter: {
        mobileCollapse: true,
        mobileTitle: 'Filter',
        left: [
            <InfluencerSwitcher key="0" />,
            <ArticleSorter key="1" sortOptions="list"/>,
            <ExploreDateRangeFilter key="2" />,
            <SitesFilter key="3" />
        ],
        right: [
            <Keywords key="0" placeholder="Filter"/>
        ]
    },

    Articles: {
        left: 'Articles'
    },

    LinksScheduling: {
        left: [
            <InfluencerFilter icon="share" key="0"/>,
            <LinkStateSelector key="1" />,
            <LinksDateRangeFilter key="2" />
        ]
    },

    Links: {
        left: [
            <InfluencerFilter icon="share" key="0"/>,
            <LinksDateRangeFilter key="1" />
        ]
    },

    Related: {
        left: 'Related Articles'
    },

    Settings: {
        left: 'User Settings'
    },

    ConnectAccounts: {
        left: 'Connect Social Accounts'
    },

    Analytics: {
        className: Styles.desktopToolbar,
        mobileCollapse: true,
        mobileTitle: 'Filter',
        left: [
            <InfluencerSwitcher key="0" />,
            <InfluencerFilter icon="share" key="1"/>,
            <AnalyticsDateRangeFilter key="2" />,
            <UsedSitesFilter key="3" />,
            <PlatformFilter key="4" />
        ],
        leftNoCollapse: [
            <AnalyticsMenu key="0" />
        ]
    },

    Accounting: {
        className: Styles.desktopToolbar,
        mobileCollapse: true,
        mobileTitle: 'Filters',
        left: [
            <InfluencerSwitcher key="0" />,
            <MonthSelector key="1" />
        ],
        leftNoCollapse: [
            <AnalyticsMenu key="1" />
        ],
        right: [
            <DownloadCSV key="2" />
        ]
    }
};

exports.Toolbars = ((specs) => {
    let map = {};
    for (const spec in specs) {
        map[spec] = createToolbar(specs[spec]);
    }
    return map;
})(exports.ToolbarSpecs);

export SelectableToolbar from './SelectableToolbar.component';
export default Toolbar;
