import React, { Component } from 'react';
import { IconButton } from 'react-toolbox';
import AltContainer from 'alt-container';
import LinkStore from '../../../stores/Link.store';
import LinkActions from '../../../actions/Link.action';

export default class ShareButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <IconButton primary icon='share' onClick={::this.showShareDialog} />;
    }

    showShareDialog(evt) {
        const { ucid } = this.props;
        LinkActions.generateLink({ ucid });
        evt.stopPropagation();
    }
}
