import React from 'react';
import AltContainer from 'alt-container';
import { AppContent, ArticleView } from '../shared';
import { ListToolbar } from '../toolbar';
import ListStore from '../../stores/List.store'
import ListActions from '../../actions/List.action'

class Related extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        ListActions.getRelatedToList(this.props.routeParams.id);
    }

    render() {
        return (
            <AltContainer 
                stores={{
                    list: props => ({
                        store: ListStore,
                        value: ListStore.getRelatedToList(this.props.routeParams.id)
                    })
                }}
                render={ props => (
                    <div>
                        <ListToolbar title="Related" />
                        <AppContent id="related">
                            <ArticleView articles={props.list.articles} preventUpdate />
                        </AppContent>
                    </div>
                ) } />
        );
    }
}

export default Related;
