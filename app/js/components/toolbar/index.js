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
    SaveArticles,
    SharePermalinkButton,
    SitesFilter,
    UsedSitesFilter,
    TopicFilter,
    AnalyticsMenu
} from './toolbar_components';


const createToolbar = function (props) {

    let mobileToolbar = false;

    if (props.mobileCollapse) {
        mobileToolbar = <MobileToolbar {...props} />
    }
    return React.createClass({
        render: function () {
            return (
                <div>
                    <Toolbar {...props} />
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
        className: Styles.flat,
        flat: true,
        left: [
            <AnalyticsMenu key="0" />,
            <InfluencerFilter icon="share" key="1"/>,
            <AnalyticsDateRangeFilter key="2" />,
            <UsedSitesFilter key="3" />
        ]
    }),

    Accounting: createToolbar({
        mobileCollapse: true,
        mobileTitle: 'Filters',
        className: Styles.flat,
        flat: true,
        left: [
            <AnalyticsMenu key="0"/>,
            <MonthSelector key="1" />
        ],
        right: [
            <DownloadCSV key="0" />
        ]
    })
};

export ExploreToolbar from './ExploreToolbar.component';
export SavedToolbar from './SavedToolbar.component';
export default Toolbar;
