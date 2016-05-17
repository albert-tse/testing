import React from 'react';
import AltContainer from 'alt-container';
import Component from './Dashboard.component';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return <AltContainer listName = "Dashboard"
        component = { Component }
        />;
    }
}

export default Dashboard;
