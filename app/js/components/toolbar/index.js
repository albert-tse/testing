import React from 'react';
import Toolbar from './Toolbar.component';
import DateRange from './toolbar_components/DateRange';
import ListToolbar from './ListToolbar.component';
import FilterToolbar from './FilterToolbar.component';

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
        children: [<DateRange key='dateRangePicker'/>]
    }),
};

export { ListToolbar, FilterToolbar };
export default Toolbar;
