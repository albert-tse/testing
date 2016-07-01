import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import AltContainer from 'alt-container';
import LinkStore from '../../../stores/Link.store';
import LinkActions from '../../../actions/Link.action';

export default class ShareButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Button
                primary
                ripple={false}
                label="Share"
                onClick={::this.onCopy}
            />
        );
    }

    onCopy(evt) {
        LinkActions.generateLink(this.props.ucid);
        evt.stopPropagation();
    }
}
