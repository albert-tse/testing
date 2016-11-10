import React, { Component } from 'react';
import { Button, Tooltip } from 'react-toolbox';
import AltContainer from 'alt-container';
import LinkStore from '../../../stores/Link.store';
import LinkActions from '../../../actions/Link.action';
import defer from 'lodash/defer';
import shallowCompare from 'react-addons-shallow-compare';
import classnames from 'classnames';
import { floating, showRipple } from './styles';
import { flip } from '../../common';

import { pick } from 'lodash';

export default class ShareButton extends Component {
    constructor(props) {
        super(props);
        this.showShareDialog = this.showShareDialog.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        const optionalAttributes = pick(this.props, 'floating', 'mini', 'accent');
        return (
            <TooltipIconButton
                className={classnames('share-button', flip, optionalAttributes.floating && floating)}
                primary={!optionalAttributes.accent}
                ripple
                icon='reply'
                onClick={this.showShareDialog}
                tooltip="Share Link"
                { ...optionalAttributes }
            />
        );
    }

    showShareDialog(evt) {
        const { ucid } = this.props;
        defer(LinkActions.generateLink, { ucid });
        evt.stopPropagation();
    }
}

const TooltipIconButton = Tooltip(Button);
