import React from 'react';
import AltContainer from 'alt-container';
import { AppContent, ArticleView } from '../shared';
import ListStore from '../../stores/List.store'
import ListActions from '../../actions/List.action'
import { Toolbars } from '../toolbar';
var Toolbar = Toolbars.Articles;

class Related extends React.Component {

    constructor(props) {
        super(props);
        console.log();
    }

    render() {
        var articles = this.props.routeParams.ids.split(',').map(function (el) {
            return { ucid: el };
        });

        return (
            <div>
                <Toolbar />
                <AppContent id="Articles">
                    <ArticleView articles={ articles } preventUpdate />
                </AppContent>
            </div>
        );
    }
}

export default Related;
