import React from 'react';
import Toolbar from './Toolbar.component';
import { ArticleSorter, ClearSelectionButton, DateRangeFilter, Keywords, MultiSelectListDropdown, SharePermalinkButton, TopicFilter } from './toolbar_components';

var createToolbar = function (props) {
    return React.createClass({
        render: function () {
            return <Toolbar {...props} />
        }
    });
};

exports.Toolbars = {
    Selection: createToolbar({
        title: <ClearSelectionButton />, // This will be a component that has an IconButton to clear the selection
        children: [<SharePermalinkButton key="1" />]
    }),

    Filter: createToolbar({
        title: <TopicFilter />,
        children: [<Keywords key="1" />, <ArticleSorter key="2" />, <DateRangeFilter key="3" />, <MultiSelectListDropdown icon="filter_list" key="4"/>]
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
        children: [<Keywords key="1" />, <DateRangeFilter key="3" />, <MultiSelectListDropdown icon="filter_list" key="4"/>]
    }),
};

export ExploreToolbar from './ExploreToolbar.component';
export default Toolbar;
