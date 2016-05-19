import React from 'react';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        index: 0
    }

    handleTabChange(index) {
        this.setState({ index });
    }

    render() {
        return (
            <div>Pretty graphs and Stuff</div>
        );
    }
}

export default Dashboard;
