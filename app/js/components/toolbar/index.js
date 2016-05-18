import React from 'react';
import Toolbar from './Toolbar.component'
import DateRange from './toolbar_components/DateRange'

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

export default Toolbar;
