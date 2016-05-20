import React from 'react';
import { Tab, Tabs } from 'react-toolbox';
import FontIcon from 'react-toolbox/lib/font_icon';
import Dashboard from './dashboard';
import SharedLinks from './sharedLinks/SharedLinks';

class SharedContent extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        index: 1
    }

    handleTabChange(index) {
        this.setState({ index });
    }

    render() {
        return (
            <Tabs index={this.state.index} onChange={::this.handleTabChange}>
              <Tab label='Dashboard'><Dashboard /></Tab>
              <Tab label='Shared Links'><SharedLinks /></Tab>
            </Tabs>
        );
    }
}

export default SharedContent;
