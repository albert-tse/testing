import React from 'react';
import Toolbar from './Toolbar.component';
import { TopicFilter, Keywords, ArticleSorter, DateRangeFilter, MultiSelectListDropdown } from './toolbar_components';

var createToolbar = function (props) {
    return React.createClass({
        render: function () {
            return <Toolbar {...props} />
        }
    });
};

exports.Toolbars = {
    Selection: createToolbar({
        title: 'Clear Selection' // This will be a component that has an IconButton to clear the selection
    }),

    Filter: createToolbar({
        title: <TopicFilter />,
        children: [<Keywords key="1" />, <ArticleSorter key="2" />, <DateRangeFilter key="3" />]
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
