import React from 'react';
import AltContainer from 'alt-container';
import Component from './SharedContent.component';
import { AppContent } from '../shared';
import { ListToolbar } from '../toolbar';

class SharedContent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <ListToolbar title="Shared Links" />
                <AppContent id="sharedlinks">  
                    <AltContainer listName = "SharedContent" component = { Component } />
                </AppContent>
            </div>
        );
    }
}

export default SharedContent;
