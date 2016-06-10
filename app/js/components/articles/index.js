import React from 'react';
import AltContainer from 'alt-container';
import { AppContent, ArticleView } from '../shared';
import ListStore from '../../stores/List.store'
import ListActions from '../../actions/List.action'
import { Toolbars } from '../toolbar';
var RelatedToolbar = Toolbars.Related;

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
                <RelatedToolbar />
                <AppContent id="Articles">
                    <ArticleView articles={ articles } preventUpdate />
                </AppContent>
            </div>
        );
    }
}

export default Related;
