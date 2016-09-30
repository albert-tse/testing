import React, { Component } from 'react';
import { Button, IconButton, Tooltip } from 'react-toolbox';
import { showOnMobile, showOnDesktop } from './styles.collapsible-button';

import pick from 'lodash/pick';

export default class CollapsibleButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let props = pick(this.props, 'icon', 'label', 'onClick');
        props.tooltip = props.label;

        return (
        	<div>
                <Button className={showOnDesktop} {...props} />
                <TooltipButton className={showOnMobile} {...props} />
            </div>
        );
    }
}

const TooltipButton = Tooltip(IconButton);
