import React, { Component, PropTypes } from 'react';
import { IconButton } from 'react-toolbox';

import Overlay from '../../shared/Overlay.component';
import { ToolbarSpecs } from '../../toolbar';

export default class FilterButton extends Component {

    constructor(props) {
        super(props);
        const toolbarSpecs = ToolbarSpecs[props.toolbar];
        this.filters = toolbarSpecs ? toolbarSpecs.left : [];
        this.toggleOverlay = this.toggleOverlay.bind(this);
        this.state = {
            show: false
        };
    }

    render() {
        return (
            <div>
                <IconButton icon="tune" primary onClick={this.toggleOverlay} />
                <Overlay active={this.state.show} fullscreen>
                    <IconButton icon="clear" onClick={this.toggleOverlay} />
                    {this.filters}
                </Overlay>
            </div>
        );
    }

    toggleOverlay() {
        this.setState({ show: !this.state.show });
    }
}
