import React, { Component } from 'react';
import { AppBar } from 'react-toolbox';
import Styles from './styles';

export default class Toolbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppBar flat className={Styles.spaceOut}>
                {this.props.children}
            </AppBar>
        );
    }
}
