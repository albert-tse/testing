import React from 'react';
import AltContainer from 'alt-container';
import ArticleView from '../shared/article/ArticleView.component';
import ListStore from '../../stores/List.store';
import ListActions from '../../actions/List.action';
import { AppBar, IconButton, Navigation, Panel } from 'react-toolbox';

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
                        <AppBar className="space-out">
                            <Navigation type="horizontal">
                                <h1 className="title">Saved</h1>
                            </Navigation>
                            <Navigation type="horizontal">
                                <IconButton icon="bookmark_border" inverse />
                                <IconButton icon="share" inverse />
                            </Navigation>
                        </AppBar>
                        { props.list.isLoading && <p>Loading...</p> }
                        <ArticleView articles={props.list.articles} />
                    </div>
                ) } />
        );
    }
}
