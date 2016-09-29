import React, { Component } from 'react';
import { IconButton, Tooltip } from 'react-toolbox';

import { headlineTooltip } from './styles';

export default class HeadlineIssue extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TooltipButton
                className={headlineTooltip}
                icon="warning"
                tooltip="This title may not follow our content guidelines. Consider rewriting before sharing."
            />
        );
    }
}

const TooltipButton = Tooltip(IconButton);
