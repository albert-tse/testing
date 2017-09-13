import React, { Component } from 'react';
import { Button, IconButton } from 'react-toolbox';
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
        this.onClick = this.props.onClick;
        this.show = this.show.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        const optionalAttributes = pick(this.props, 'primary', 'label', 'floating', 'mini', 'accent');
        const className = classnames(
            'onboardStep share-button',
            flip,
            optionalAttributes.floating && floating,
            this.props.isOnCard && mini
        );

        let props = {
            className: className,
            primary: optionalAttributes.primary,
            ripple: true,
            icon: 'reply',
            onClick: this.show,
            title: "Share Story",
            ...optionalAttributes
        };

        const ElementType = this.props.isOnCard ? IconButton : Button;
        return <ElementType {...props} />
    }

    show(evt) {
        this.onClick(this.props.article);
        evt.stopPropagation();
    }
}
