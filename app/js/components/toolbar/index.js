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

// TODO: Remove and listen to Filter state changes on components that are being triggered here
const updateDashboard = () => defer(() => {
    InfluencerActions.searchClicks();
    InfluencerActions.searchLinks();
});

exports.Toolbars = {
    Selection: createToolbar({
        className: Styles.selectionToolbar,
        leftSection: [
            <ClearSelectionButton />
        ],
        rightSection: [
            <SaveArticles key="1" />,
            <SharePermalinkButton key="2" />,
            <BatchSaveLinks key="3" />
        ]
    }),

    Filter: createToolbar({
        leftSection: [
            <TopicFilter key="0" />,
            <ArticleSorter key="1" />
        ],
        rightSection: [
            <Keywords key="0" />,
            <DateRangeFilter key="1" />,
            <MultiSelectListDropdown icon="filter_list" key="2" />
        ]
    }),

    Articles: createToolbar({
        leftSection: 'Articles'
    }),

    Links: createToolbar({
        rightSection: [
            <DateRangeFilter key="1" />,
            <MultiSelectListDropdown icon="filter_list" key="2"/>
        ]
    }),

    Related: createToolbar({
        leftSection: 'Related Articles'
    }),

    Saved: createToolbar({
    }),

    Settings: createToolbar({
        leftSection: 'Settings'
    }),

    // TODO This may not be updateDashboard
    Shared: createToolbar({
        leftSection: <Keywords />,
        rightSection: [
            <DateRangeFilter key="0" onSelect={updateDashboard} />,
            <MultiSelectListDropdown icon="filter_list" key="1" onSelect={updateDashboard} />,
            //<InfluencerFilter icon="share" key="5"/>
        ]
    }),
};

export ExploreToolbar from './ExploreToolbar.component';
export SavedToolbar from './SavedToolbar.component';
export default Toolbar;
