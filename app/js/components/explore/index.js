import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { AppContent, ArticleView } from '../shared';
import { ExploreToolbar } from '../toolbar';
import SearchStore from '../../stores/Search.store';
import SearchActions from '../../actions/Search.action';

export default class Explore extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        SearchActions.getResults();
    }

    render() {
        return (
            <AltContainer
                stores={{
                    articles: props => ({
                        store: SearchStore,
                        value: SearchStore.getState().results
                    })
                }}
                render={ props => (
                    <div>
                        <ExploreToolbar />
                        <AppContent id="explore">
                            <ArticleView articles={props.articles} />
                        </AppContent>
                    </div>
                )}
            />
        );
    }
}
