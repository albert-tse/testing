import React from 'react';
import AltContainer from 'alt-container';
import { AppContent, ArticleView } from '../shared';
import ListStore from '../../stores/List.store'
import ListActions from '../../actions/List.action'
import { SelectableToolbar} from '../toolbar';

import ProfileActions from '../../actions/Profile.action';

class Related extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        ListActions.getRelatedToList(this.props.routeParams.id);
        ProfileActions.loadProfiles()
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
                        <SelectableToolbar toolbar="Related" />
                        <AppContent id="related">
                            <ArticleView
                                fullscreen
                                articles={props.list.articles}
                                preventUpdate
                            />
                        </AppContent>
                    </div>
                ) } />
        );
    }
}
export default Related;

