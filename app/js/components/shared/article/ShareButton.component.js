import React, { Component } from 'react';
import { IconMenu, MenuItem, Tooltip } from 'react-toolbox';
import AltContainer from 'alt-container';
import LinkStore from '../../../stores/Link.store';
import LinkActions from '../../../actions/Link.action';
import FilterActions from '../../../actions/Filter.action';
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
                onClick={evt => evt.stopPropagation()}
                onSelect={::this.onSelect}
            >
                <MenuItem value="copy" caption="Get Link" />
                <MenuItem value="facebook" caption="Share on Facebook" />
                <MenuItem value="twitter" caption="Share on Twitter" />
            </IconMenu>
        );
    }

    onSelect(action) {
        const { ucid } = this.props;

        if (action === 'copy') {
            this.onCopy(ucid);
        } else {
            this.onDirectShare(action)(ucid);
        }
    }

    onCopy(ucid) {
        LinkActions.generateLink({ ucid });
        FilterActions.clearSelection();
    }

    onDirectShare(platform) {
        return function (ucid) {
            LinkActions.generateLink({ ucid, platform: platform });
            FilterActions.clearSelection();
        };
    }
}
