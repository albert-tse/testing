import React from 'react';
import { Button } from 'react-toolbox';
import ToolbarComponent from './Toolbar.component';
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
    ClearSelectionButton,
    AnalyticsDateRangeFilter,
    CalendarMenu,
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
//import AddToListButton from '../shared/article/AddToListButton.component'
import SaveToListButton from '../shared/article/SaveToListButton.component'
import ProfileSelector from '../multi-influencer-selector';

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

const ToolbarPure = function (props) {
    return (
        <div className={Styles.responsiveToolbar}>
            <ToolbarComponent {...props} />
        </div>
    );
};

export const ToolbarSpecs = {
    Selection: {
        className: Styles.selectionToolbar,
        left: <ClearSelectionButton />, // This will be a component that has an IconButton to clear the selection
        right: [
            /*<SaveArticles key="0" />,*/
            /*<AddToListButton key="1" ucid={-1}/>,*/
            <SaveToListButton key="1" ucid={-1} />,
            <SharePermalinkButton key="2" />
        ]
    },

    ListSelection: {
        className: Styles.selectionToolbar,
        left: <ClearSelectionButton />, // This will be a component that has an IconButton to clear the selection
        right: [
            /*<SaveArticles key="0" />,*/
            <RemoveFromListButton key="1"/>,
            <SaveToListButton key="2" ucid={-1} />,
            /*<AddToListButton key="2" ucid={-1}/>,*/
            <SharePermalinkButton key="3" />
        ]
    },

    SelectionOnSaved: {
        className: Styles.selectionToolbar,
        left: <ClearSelectionButton />, // This will be a component that has an IconButton to clear the selection
        right: [
            /*<SaveArticles key="0" label="Remove From List" />,*/
            <RemoveFromListButton key="0"/>,
            <SaveToListButton key="1" ucid={-1} />,
            <SharePermalinkButton key="2" />
        ]
    },

    Filter: {
        mobileCollapse: false, // TODO: add new component for filters
        className: classnames(Styles.filterToolbar, Styles.desktopToolbar),
        mobileTitle: 'Filter',
        flat: true,
        left: [
            <ProfileSelector type="dropdown" key="0" />,
            <ArticleSorter key="1" />,
            <ExploreDateRangeFilter key="2" />,
            <SitesFilter key="3" />
        ]
    },

    TopPerformingFilter: {
        mobileCollapse: false,
        className: classnames(Styles.filterToolbar, Styles.desktopToolbar),
        mobileTitle: 'Filter',
        flat: true,
        left: [
            <ProfileSelector type="dropdown" key="0" />,
            <SitesFilter key="1" />
        ]
    },

    ListFilter: {
        mobileCollapse: true,
        mobileTitle: 'Filter',
        left: [
            <ProfileSelector type="dropdown" key="0" />,
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
        className: Styles.transparent,
        flat: true,
        left: [
            <LinksDateRangeFilter key="0" />
        ],
        right: [
            <DownloadLinksCSV key="0" />
        ]
    },

    Links: {
        left: [
            <LinksDateRangeFilter key="0" />
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
        ],
        center: [
            <CalendarMenu key="0" />,
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

/**
 * A new toolbar component that allows for owner to pass props
 * that would override the properties set in ToolbarSpecs
 */
function Toolbar({ name, ...props }) {
    return ToolbarPure({ ...exports.ToolbarSpecs[name], ...props });
}

export SelectableToolbar from './SelectableToolbar.component';
export default Toolbar;
