import React, { Component } from 'react';
import { IconButton } from 'react-toolbox';

export default class SaveButton extends Component {
    constructor (props) {
        super(props);
        console.log(this.props.isSaved ? 'accent' : 'primary');
    }

    render() {
        return (
            <IconButton icon='bookmark' primary={!this.props.isSaved} accent={this.props.isSaved} />
        );
    }
}
