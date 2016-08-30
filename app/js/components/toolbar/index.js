import React from 'react';
import { Button } from 'react-toolbox';
import Toolbar from './Toolbar.component';
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
    TopicFilter
} from './toolbar_components';


const createToolbar = function (props) {
    return React.createClass({
        render: function () {
            return <Toolbar {...props} />
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
        left: 'Settings'
    }),

    Analytics: createToolbar({
        className: Styles.flat,
        flat: true,
        left: [
            <InfluencerFilter icon="share" key="0"/>,
            <AnalyticsDateRangeFilter key="1" />,
            <UsedSitesFilter key="2" />
        ]
    }),

    Accounting: createToolbar({
        className: Styles.flat,
        flat: true,
        left: [
            <MonthSelector key="0" />
        ],
        right: [
            <DownloadCSV key="0" />
        ]
    })
};

export ExploreToolbar from './ExploreToolbar.component';
export SavedToolbar from './SavedToolbar.component';
export default Toolbar;
