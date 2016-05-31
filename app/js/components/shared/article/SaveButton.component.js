import React, { Component } from 'react';
import { IconButton } from 'react-toolbox';

export default class SaveButton extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <IconButton icon='bookmark' primary />
        );
    }
}
