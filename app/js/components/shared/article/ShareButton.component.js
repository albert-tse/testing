import React, { Component } from 'react';
import { pick } from 'lodash';
import defer from 'lodash/defer';
import shallowCompare from 'react-addons-shallow-compare';
import classnames from 'classnames';

import { Button, IconButton } from '../../index';
import { floating, showRipple } from './styles';
import { flip } from '../../common';
import { mini } from './styles.action-buttons';

import LinkStore from '../../../stores/Link.store';
import LinkActions from '../../../actions/Link.action';

const ShareIcon = () => (
    <svg viewBox="0 0 511.626 511.627">
        <g>
            <path d="M506.206,179.012L360.025,32.834c-3.617-3.617-7.898-5.426-12.847-5.426s-9.233,1.809-12.847,5.426   c-3.617,3.619-5.428,7.902-5.428,12.85v73.089h-63.953c-135.716,0-218.984,38.354-249.823,115.06C5.042,259.335,0,291.03,0,328.907   c0,31.594,12.087,74.514,36.259,128.762c0.57,1.335,1.566,3.614,2.996,6.849c1.429,3.233,2.712,6.088,3.854,8.565   c1.146,2.471,2.384,4.565,3.715,6.276c2.282,3.237,4.948,4.859,7.994,4.859c2.855,0,5.092-0.951,6.711-2.854   c1.615-1.902,2.424-4.284,2.424-7.132c0-1.718-0.238-4.236-0.715-7.569c-0.476-3.333-0.715-5.564-0.715-6.708   c-0.953-12.938-1.429-24.653-1.429-35.114c0-19.223,1.668-36.449,4.996-51.675c3.333-15.229,7.948-28.407,13.85-39.543   c5.901-11.14,13.512-20.745,22.841-28.835c9.325-8.09,19.364-14.702,30.118-19.842c10.756-5.141,23.413-9.186,37.974-12.135   c14.56-2.95,29.215-4.997,43.968-6.14s31.455-1.711,50.109-1.711h63.953v73.091c0,4.948,1.807,9.232,5.421,12.847   c3.62,3.613,7.901,5.424,12.847,5.424c4.948,0,9.232-1.811,12.854-5.424l146.178-146.183c3.617-3.617,5.424-7.898,5.424-12.847   C511.626,186.92,509.82,182.636,506.206,179.012z"></path>
        </g>
    </svg>
)

// TODO make sure that the color and size of the share icon is appropriate for icon and button components

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
            optionalAttributes.floating && floating,
            this.props.isOnCard && mini
        );

        let props = {
            className: className,
            primary: optionalAttributes.primary,
            icon: <ShareIcon />,
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
