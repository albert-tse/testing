import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { AppContent, ArticleView } from '../shared';
import { FilterToolbar } from '../toolbar';

export default class Explore extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                render={ props => (
                    <div>
                        <FilterToolbar title="Explore" />
                        <AppContent id="explore">
                            <ArticleView articles={[]} />
                        </AppContent>
                    </div>
                )}
            />
        );
    }
}
