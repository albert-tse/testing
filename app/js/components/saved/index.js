import React from 'react';
import AltContainer from 'alt-container';
import ListStore from '../../stores/List.store';
import ListActions from '../../actions/List.action';
import { AppContent, ArticleView } from '../shared';
import { ListToolbar } from '../toolbar';
import { Panel } from 'react-toolbox';

export default class Saved extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        ListActions.getSavedList();
    }

    render() {
        return (
            <AltContainer 
                stores={{
                    list: props => ({
                        store: ListStore,
                        value: ListStore.getSavedList()
                    })
                }}
                render={ props => (
                    <div>
                        <ListToolbar />
                        <AppContent id="saved">
                            <ArticleView articles={props.list.articles} />
                        </AppContent>
                    </div>
                ) } />
        );
    }
}
