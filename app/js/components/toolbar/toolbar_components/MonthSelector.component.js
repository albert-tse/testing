import React, { Component } from 'react';
import { Dropdown } from 'react-toolbox';

export default class MonthSelector extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Dropdown
                label="Select Month"
                source={source}
                value={source[0].value}
            />
        );
    }
}

const source = [{
        label: 'July 2016',
        value: new Date()
    }, {
        label: 'June 2016',
        value: new Date()
    }, {
        label: 'May 2016',
        value: new Date()
    }
];
