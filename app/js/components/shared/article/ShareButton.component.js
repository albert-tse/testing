import React, { Component } from 'react';
import { IconButton, Tooltip } from 'react-toolbox';
import AltContainer from 'alt-container';
import LinkStore from '../../../stores/Link.store';
import LinkActions from '../../../actions/Link.action';

export default class ShareButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {  
        const TooltipIconButton = Tooltip(IconButton);
        return (
            <TooltipIconButton
                primary
                icon="share"
                onClick={::this.onCopy}
                tooltip="Get Link"
            />
        );
    }

    onCopy(evt) {
        LinkActions.generateLink(this.props.ucid);
        evt.stopPropagation();
    }
}
