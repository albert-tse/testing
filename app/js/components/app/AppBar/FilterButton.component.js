import React, { Component, PropTypes } from 'react';
import { AppBar, Button, IconButton, Panel } from 'react-toolbox';
import classnames from 'classnames';

import Overlay from '../../shared/Overlay.component';
import { ToolbarSpecs } from '../../toolbar';
import { appBar, withIcon, content } from './styles';

export default class FilterButton extends Component {

    constructor(props) {
        super(props);
        this.toggleOverlay = this.toggleOverlay.bind(this);
        this.state = {
            show: false
        };
    }

    render() {
        const toolbarSpecs = ToolbarSpecs[this.props.toolbar];
        this.filters = this.props.filters || (toolbarSpecs ? toolbarSpecs.left : []);
        return (
            <div>
                <IconButton icon="tune" neutral={false} onClick={this.toggleOverlay} />
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
