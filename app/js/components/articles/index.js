import React from 'react';
import AltContainer from 'alt-container';
import { AppContent, ArticleView } from '../shared';
import ListStore from '../../stores/List.store'
import ListActions from '../../actions/List.action'
import { SelectableToolbar, Toolbars } from '../toolbar';

class Related extends React.Component {

    constructor(props) {
        super(props);
        ListActions.loadMyLists();
    }

    render() {
        var articles = this.props.routeParams.ids.split(',').map(function (el) {
            return { ucid: el };
        });

        return (
            <div>
                <SelectableToolbar toolbar="Articles" />
                <AppContent id="Articles">
                    <ArticleView articles={ articles } />
                </AppContent>
            </div>
        );
    }
}

export default Related;
