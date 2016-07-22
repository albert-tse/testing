import React, { Component } from 'react';
import { IconButton } from 'react-toolbox';
import AltContainer from 'alt-container';
import LinkStore from '../../../stores/Link.store';
import LinkActions from '../../../actions/Link.action';
import defer from 'lodash/defer';
import shallowCompare from 'react-addons-shallow-compare';

export default class ShareButton extends Component {
    constructor(props) {
        super(props);
        this.showShareDialog = this.showShareDialog.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        return <IconButton primary icon='share' onClick={this.showShareDialog} />;
    }

    showShareDialog(evt) {
        const { ucid } = this.props;
        defer(LinkActions.generateLink, { ucid });
        evt.stopPropagation();
    }
}
