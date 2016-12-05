import React, { Component } from 'react';
import { render } from 'react-dom';

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
        return <div ref={c => this.target = c} children={this.props.children} />;
    }
}
