import React, { Component, PropTypes } from 'react';
import { AppBar, Button, IconButton, Panel } from 'react-toolbox';
import classnames from 'classnames';

import Overlay from '../../shared/Overlay.component';
import { ToolbarSpecs } from '../../toolbar';
import { appBar, withIcon, content } from './styles';

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
                    <AppBar flat className={classnames(appBar, withIcon)}>
                        <IconButton icon="clear" onClick={this.toggleOverlay} />
                        <Button label="done" onClick={this.toggleOverlay} />
                    </AppBar>
                    <div className={content}>
                        {this.filters}
                    </div>
                </Overlay>
            </div>
        );
    }

    toggleOverlay() {
        this.setState({ show: !this.state.show });
    }
}
