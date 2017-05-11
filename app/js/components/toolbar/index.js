import React from 'react';
import { Button } from 'react-toolbox';
import Toolbar from './Toolbar.component';
import SearchActions from '../../actions/Search.action';
import InfluencerStore from '../../stores/Influencer.store';
import InfluencerActions from '../../actions/Influencer.action';
import History from '../../history';
import Config from '../../config';
import defer from 'lodash/defer';
import Styles from './styles';
import classnames from 'classnames';
import InfluencerSwitcher from '../app/AppBar/InfluencerSwitcher.component';
import { ArticleSorter,
    BatchSaveLinks,
    ClearSelectionButton,
    AnalyticsDateRangeFilter,
    DownloadCSV,
    DownloadLinksCSV,
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
    LinksDateRangeFilter,
    ManageList
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
            <SaveArticles key="0" label="Remove From List" />,
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
        ]
    },

    TopPerformingFilter: {
        mobileCollapse: false,
        className: classnames(Styles.filterToolbar, Styles.desktopToolbar),
        mobileTitle: 'Filter',
        flat: true,
        left: [
            <InfluencerSwitcher key="0" />,
            <SitesFilter key="1" />
        ],
        right: []
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
            <ManageList key="1" />
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
        ],
        right: [
            <DownloadLinksCSV key="0" />
        ]
    },

    Links: {
        left: [
            <InfluencerFilter icon="share" key="0"/>,
            <LinksDateRangeFilter key="1" />
        ],
        right: [
            <DownloadLinksCSV key="0" />
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
    },

    Global: {
        className: Styles.desktopToolbar,
        mobileCollapse: true,
        mobileTitle: 'Filters',
        left: [
            <MonthSelector key="1" />
        ],
        leftNoCollapse: [
            <AnalyticsMenu key="1" />
        ]
    },

    Calendar: {
        className: Styles.desktopToolbar,
        mobileCollapse: false,
        left: [
            <LinkStateSelector key="0" />
        ],
        right: [ // TODO: we should add a center to Toolbar component
            // TODO: add property like onClick={History.push(Config.routes[insert route name here]}
            <Button label="My Links" key="0" onClick={ History.push.bind(this, Config.routes.links) } />,
            <Button label="Queue" key="1" />,
            <Button label="Edit Schedule" key="2" />
        ],
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
