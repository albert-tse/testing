import React, { Component } from 'react';
import { AppContent } from '../shared';
import { content } from './styles';

export default class Accounting extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppContent className={content}>
                <h1>Hello world</h1>
            </AppContent>
        );
    }
}
