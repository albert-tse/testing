import React from 'react';
import { Button } from 'react-toolbox';
import Toolbar from './Toolbar.component';
import MobileToolbar from './MobileToolbar.component';
import SearchActions from '../../actions/Search.action';
import InfluencerStore from '../../stores/Influencer.store';
import InfluencerActions from '../../actions/Influencer.action';
import defer from 'lodash/defer';
import Styles from './styles';
import { ArticleSorter,
    BatchSaveLinks,
    ClearSelectionButton,
    ClearSavedArticlesButton,
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
    AnalyticsMenu
} from './toolbar_components';


const createToolbar = function (props) {

    let mobileToolbar = false;
    let desktopToolbarClass = '';

    if (props.mobileCollapse) {
        mobileToolbar = <MobileToolbar {...props} />
        desktopToolbarClass = Styles.mobileHide;
    }

    return React.createClass({
        render: function () {
            return (
                <div>
                    <Toolbar className={desktopToolbarClass} {...props} />
                    {mobileToolbar}
                </div>
                )
        }
    });
};

exports.Toolbars = {
    Selection: createToolbar({
        className: Styles.selectionToolbar,
        left: <ClearSelectionButton />, // This will be a component that has an IconButton to clear the selection
        right: [
            <SaveArticles key="0" />,
            <SharePermalinkButton key="1" />,
            <BatchSaveLinks key="2" />
        ]
    }),

    SelectionOnSaved: createToolbar({
        className: Styles.selectionToolbar,
        left: <ClearSelectionButton />, // This will be a component that has an IconButton to clear the selection
        right: [
            <SaveArticles key="0" label="Remove From My Posts" />,
            <SharePermalinkButton key="1" />,
            <BatchSaveLinks key="2" />
        ]
    }),

    Filter: createToolbar({
        mobileCollapse: true,
        mobileTitle: 'Filter',
        left: [
            <TopicFilter key="0" />,
            <ArticleSorter key="1" />,
            <ExploreDateRangeFilter key="2" />,
            <SitesFilter key="3" />
        ],
        right: [
            <Keywords key="0" />
        ]
    }),

    Articles: createToolbar({
        left: 'Articles'
    }),

    Links: createToolbar({
        left: [
            <AnalyticsDateRangeFilter key="0" />,
            <SitesFilter key="1" />
        ]
    }),

    Related: createToolbar({
        left: 'Related Articles'
    }),

    Saved: createToolbar({
        left: <ClearSavedArticlesButton />
    }),

    Settings: createToolbar({
        left: 'User Settings'
    }),

    Analytics: createToolbar({
        mobileCollapse: true,
        mobileTitle: 'Filter',
        left: [
            <InfluencerFilter icon="share" key="0"/>,
            <AnalyticsDateRangeFilter key="1" />,
            <UsedSitesFilter key="2" />,
            <PlatformFilter key="3" />
        ],
        leftNoCollapse: [
            <AnalyticsMenu key="0" />
        ]
    }),

    Accounting: createToolbar({
        mobileCollapse: true,
        mobileTitle: 'Filters',
        left: [
            <MonthSelector key="0" />
        ],
        leftNoCollapse: [
            <AnalyticsMenu key="0" />
        ],
        right: [
            <DownloadCSV key="0" />
        ]
    })
};

export ExploreToolbar from './ExploreToolbar.component';
export SavedToolbar from './SavedToolbar.component';
export default Toolbar;
