import React, { Component } from 'react';
import { IconButton, Tooltip } from 'react-toolbox';
import AltContainer from 'alt-container';
import LinkStore from '../../../stores/Link.store';
import LinkActions from '../../../actions/Link.action';
import defer from 'lodash/defer';
import shallowCompare from 'react-addons-shallow-compare';
import classnames from 'classnames';
import { showRipple } from './styles';
import { flip } from '../../common';

export default class ShareButton extends Component {
    constructor(props) {
        super(props);
        this.showShareDialog = this.showShareDialog.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        return (
            <TooltipIconButton
                className={classnames('share-button', flip)}
                primary
                ripple
                icon='reply'
                onClick={this.showShareDialog}
                tooltip="Share Link"
            />
        );
    }

    showShareDialog(evt) {
        const { ucid } = this.props;
        defer(LinkActions.generateLink, { ucid });
        evt.stopPropagation();
    }
}

const TooltipIconButton = Tooltip(IconButton);
