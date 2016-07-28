import React, { Component } from 'react';
import { IconButton } from 'react-toolbox';
import AltContainer from 'alt-container';
import LinkStore from '../../../stores/Link.store';
import LinkActions from '../../../actions/Link.action';
import defer from 'lodash/defer';
import shallowCompare from 'react-addons-shallow-compare';
import classnames from 'classnames';
import { showRipple } from './styles';

export default class ShareButton extends Component {
    constructor(props) {
        super(props);
        this.showShareDialog = this.showShareDialog.bind(this);
        this.ripple = this.ripple.bind(this);
        this.state = {
            showRipple: false,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        const className = classnames(this.state.showRipple && showRipple);
        return (
            <IconButton
                primary
                icon='share'
                className={className}
                onClick={this.showShareDialog}
                onMouseDown={this.ripple}
            />
        );
    }

    showShareDialog(evt) {
        const { ucid } = this.props;
        defer(LinkActions.generateLink, { ucid });
        evt.stopPropagation();
    }

    ripple(evt) {
        evt.preventDefault();
        this.setState({ showRipple: true });

        setTimeout(() => {
            this.setState({ showRipple: false });
        }, 1000);
    }
}
