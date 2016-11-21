import React, { Component } from 'react';
import { Button, IconButton, Tooltip } from 'react-toolbox';
import { showOnMobile, showOnDesktop } from './styles.collapsible-button';

import pick from 'lodash/pick';
import classnames from 'classnames';

export default class CollapsibleButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let props = pick(this.props, 'icon', 'label', 'onClick');
        props.tooltip = props.label;

        return (
        	<div>
                <Button className={classnames(showOnDesktop, this.props.className)} {...props} />
                <TooltipButton className={classnames(showOnMobile, this.props.className)} {...props} />
            </div>
        );
    }
}

const TooltipButton = Tooltip(IconButton);
