import React from 'react';
import AltContainer from 'alt-container';
import { AppContent, ArticleView } from '../shared';
import ListStore from '../../stores/List.store'
import ListActions from '../../actions/List.action'
import { SelectableToolbar, Toolbars } from '../toolbar';

import ProfileActions from '../../actions/Profile.action';

class Related extends React.Component {

    constructor(props) {
        super(props);
        ListActions.loadMyLists();
    }

    componentDidMount() {
        ProfileActions.loadProfiles();
    }

    render() {
        var articles = this.props.routeParams.ids.split(',').map(function (el) {
            return { ucid: el };
        });

        return (
            <div>
                <SelectableToolbar toolbar="Articles" />
                <AppContent id="Articles">
                    <ArticleView fullscreen articles={articles} />
                </AppContent>
            </div>
        );
    }
}

export default Related;
