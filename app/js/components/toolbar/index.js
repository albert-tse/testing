import React from 'react';
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
    DateRangeFilter,
    InfluencerFilter,
    Keywords,
    MultiSelectListDropdown,
    SaveArticles,
    SharePermalinkButton,
    SitesFilter,
    TopicFilter
    } from './toolbar_components';

const createToolbar = function (props) {
    return React.createClass({
        render: function () {
            return <Toolbar {...props} />
        }
    });
};

// TODO: Remove and listen to Filter state changes on components that are being triggered here
const updateDashboard = () => defer(() => {
    InfluencerActions.searchClicks();
    InfluencerActions.searchLinks();
});

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
            <DateRangeFilter key="2" />,
            <SitesFilter key="3" />
            // <MultiSelectListDropdown icon="filter_list" key="2" />
        ],
        right: [
            <Keywords key="0" />
        ]
    }),

    Articles: createToolbar({
        left: 'Articles'
    }),

    Links: createToolbar({
        right: [
            <DateRangeFilter key="1" />,
            <MultiSelectListDropdown icon="filter_list" key="2"/>
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

    // TODO This may not be updateDashboard
    Shared: createToolbar({
        left: [
            <DateRangeFilter key="0" onSelect={updateDashboard} />,
            <SitesFilter key="1" onSelect={updateDashboard} />
        ],
        right: [
            <Keywords key="0" />
            // <MultiSelectListDropdown icon="filter_list" key="2" onSelect={updateDashboard} />,
            //<InfluencerFilter icon="share" key="5"/>
        ]
    }),
};

export ExploreToolbar from './ExploreToolbar.component';
export SavedToolbar from './SavedToolbar.component';
export default Toolbar;
