import React, { Component } from 'react';
import { render } from 'react-dom';
import classnames from 'classnames';

import Styles from './styles.overlay';

export default class Overlay extends Component {

    constructor(props) {
        super(props);
        this.isDOMAvailable = document && document.body;
        this.container = document.body;
    }

    componentDidMount() {
        this.container.appendChild(this.target);
    }

    componentWillUnMount() {
        this.container.removeChild(this.mountTarget);
    }

    render() {
        return (
            <div 
                className={classnames(this.props.fullscreen && Styles.fullscreen)}
                style={{ display: this.props.active ? 'block' : 'none' }}
                ref={c => this.target = c}
                children={this.props.children}
            />
        );
    }
}

Overlay.defaultProps = {
    active: true
};
