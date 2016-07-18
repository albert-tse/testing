import React, { Component } from 'react';
import { IconMenu, MenuItem, Tooltip } from 'react-toolbox';
import AltContainer from 'alt-container';
import LinkStore from '../../../stores/Link.store';
import LinkActions from '../../../actions/Link.action';
import Styles from './styles';

export default class ShareButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <IconMenu
                icon="share"
                position="auto"
                className={Styles.showOnHover}
                onClick={evt => evt.stopPropagation()}
            >
                <MenuItem value="copy" caption="Get Link" onClick={evt => console.log(evt)} />
            </IconMenu>
        );
    }

    /*
    render() {
        const TooltipIconButton = Tooltip(IconButton);
        return (
            <TooltipIconButton
                primary
                className={Styles.showOnHover}
                icon="share"
                onClick={::this.onCopy}
                tooltip="Get Link"
            />
        );
    }
    */

    onCopy(evt) {
        LinkActions.generateLink(this.props.ucid);
        evt.stopPropagation();
    }
}
