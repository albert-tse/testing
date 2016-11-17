import React, { Component } from 'react';
import { Button, IconButton, Tooltip } from 'react-toolbox';
import AltContainer from 'alt-container';
import { pick } from 'lodash';
import defer from 'lodash/defer';
import shallowCompare from 'react-addons-shallow-compare';
import classnames from 'classnames';

import { floating, showRipple } from './styles';
import { flip } from '../../common';
import { mini } from './styles.action-buttons';

import LinkStore from '../../../stores/Link.store';
import LinkActions from '../../../actions/Link.action';

export default class ShareButton extends Component {
    constructor(props) {
        super(props);
        this.showShareDialog = this.showShareDialog.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        const optionalAttributes = pick(this.props, 'floating', 'mini', 'accent', 'isOnCard');
        const className = classnames(
            'share-button',
            flip,
            optionalAttributes.floating && floating,
            optionalAttributes.isOnCard && mini
        );

        const props = {
            className: className,
            primary: !optionalAttributes.accent || optionalAttributes.isOnCard,
            ripple: true,
            icon: 'reply',
            onClick: this.showShareDialog,
            tooltip: "Share Link",
            ...optionalAttributes
        };

        const ElementType = optionalAttributes.isOnCard ? TooltipIconButton : Button;
        return <ElementType {...props} />
    }

    showShareDialog(evt) {
        const { ucid } = this.props;
        defer(LinkActions.generateLink, { ucid });
        evt.stopPropagation();
    }
}

const TooltipIconButton = Tooltip(IconButton);
