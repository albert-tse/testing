import React from 'react';
import Toolbar from './Toolbar.component';
import { ArticleSorter, BatchSaveLinks, ClearSelectionButton, DateRangeFilter, Keywords, MultiSelectListDropdown, SharePermalinkButton, SaveArticles, TopicFilter, InfluencerFilter } from './toolbar_components';
import SearchActions from '../../actions/Search.action';
import InfluencerStore from '../../stores/Influencer.store';
import InfluencerActions from '../../actions/Influencer.action';
import defer from 'lodash/defer';
import Styles from './styles';

const createToolbar = function (props) {
    return React.createClass({
        render: function () {
            return <Toolbar {...props} />
        }
    });
};

const updateResults = () => defer(SearchActions.getResults);
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
            <TopicFilter />,
            <ArticleSorter key="0" />,
            <DateRangeFilter key="1" />,
            <MultiSelectListDropdown icon="filter_list" key="2" />
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
    }),

    Settings: createToolbar({
        left: 'Settings'
    }),

    // TODO This may not be updateDashboard
    Shared: createToolbar({
        left: <Keywords />,
        right: [
            <DateRangeFilter key="0" onSelect={updateDashboard} />,
            <MultiSelectListDropdown icon="filter_list" key="1" onSelect={updateDashboard} />,
            //<InfluencerFilter icon="share" key="5"/>
        ]
    }),
};

export ExploreToolbar from './ExploreToolbar.component';
export SavedToolbar from './SavedToolbar.component';
export default Toolbar;
