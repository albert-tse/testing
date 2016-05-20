import React, { Component } from 'react';
import { AppBar } from 'react-toolbox';

export default class Toolbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppBar flat>
                {this.props.children}
            </AppBar>
        );
    }
}
