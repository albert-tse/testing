import React from 'react';
import Toolbar from './Toolbar.component';
import { ArticleSorter, BatchSaveLinks, ClearSelectionButton, DateRangeFilter, Keywords, MultiSelectListDropdown, SharePermalinkButton, SaveArticles, TopicFilter } from './toolbar_components';
import SearchActions from '../../actions/Search.action';
import _ from 'lodash';

var createToolbar = function (props) {
    return React.createClass({
        render: function () {
            return <Toolbar {...props} />
        }
    });
};

var updateResults = () => _.defer(SearchActions.getResults);

exports.Toolbars = {
    Selection: createToolbar({
        title: <ClearSelectionButton />, // This will be a component that has an IconButton to clear the selection
        children: [
            <SaveArticles key="1" />,
            <SharePermalinkButton key="2" />,
            <BatchSaveLinks key="3" />
        ]
    }),

    Filter: createToolbar({
        title: <TopicFilter onChange={updateResults} />,
        children: [
            <Keywords key="1" />,
            <ArticleSorter key="2" onSelect={updateResults} />,
            <DateRangeFilter key="3" onSelect={updateResults} />,
            <MultiSelectListDropdown icon="filter_list" key="4"/>
        ]
    }),

    Articles: createToolbar({
        title: 'Articles'
    }),

    Links: createToolbar({
        title: 'Links',
        children: [
            <DateRangeFilter key="1" />,
            <MultiSelectListDropdown icon="filter_list" key="2"/>
        ]
    }),

    Related: createToolbar({
        title: 'Related Articles'
    }),

    Saved: createToolbar({
        title: 'Saved'
    }),

    Settings: createToolbar({
        title: 'Settings'
    }),

    Shared: createToolbar({
        title: 'Shared',
        children: [
            <Keywords key="1" />,
            <DateRangeFilter key="3" />,
            <MultiSelectListDropdown icon="filter_list" key="4"/>
        ]
    }),
};

export ExploreToolbar from './ExploreToolbar.component';
export default Toolbar;
