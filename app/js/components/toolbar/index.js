import React from 'react';
import Toolbar from './Toolbar.component';
import DateRange from './toolbar_components/DateRange';
import ListToolbar from './ListToolbar.component';
import FilterToolbar from './FilterToolbar.component';
import Keywords from './toolbar_components/Keywords.component';
import ArticleSorter from './toolbar_components/ArticleSorter.component';
import DateRangeFilter from './toolbar_components/DateRangeFilter.component';
import TopicFilter from './toolbar_components/TopicFilter.component';

var comps = {
    DateRange: DateRange
};

var createToolbar = function(props) {
    return React.createClass({
        render: function() {
            return <Toolbar {...props} />
        }
    });
};

exports.Components = comps;

exports.Toolbars = {
    Explore: createToolbar({
        title: <TopicFilter />,
        children: [<Keywords key="1" />,<ArticleSorter key="2" />,<DateRangeFilter key="3" />]
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
        children: [<Keywords key="1" />,<DateRangeFilter key="3" />]
    }),
};

export default Toolbar;
