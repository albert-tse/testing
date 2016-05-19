import React from 'react';
import AltContainer from 'alt-container';
import Component from './SharedContent.component';

class SharedContent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return <AltContainer listName = "SharedContent"
        component = { Component }
        />;
    }
}

export default SharedContent;
