import React from 'react';
import AltContainer from 'alt-container';
import { Button } from 'react-toolbox/lib/button';
import ListStore from '../../stores/List.store';
import ListActions from '../../actions/List.action';
import { AppContent, ArticleView } from '../shared';
import { Toolbars } from '../toolbar';
import Style from './style';
var SavedToolbar = Toolbars.Saved;

export default class Saved extends React.Component {

    pageSize = 25

    constructor(props) {
        super(props);
        this.state = {
            page: 0
        }
    }

    componentDidMount() {
        ListActions.getSavedList();
    }

    handleScroll(event) {
        var target = $(event.target);
        var scrollTopMax = target.prop('scrollHeight') - target.innerHeight();
        var scrollTop = target.scrollTop();

        if (scrollTop / scrollTopMax > .75) {::this.loadMore(); }
    }

    loadMore() {
        this.setState({
            page: this.state.page + 1
        });
    }

    render() {
        var stores = {
            list: props => ({
                store: ListStore,
                value: ListStore.getSavedList()
            })
        };

        var render = props => (
            <div>
                <SavedToolbar />
                <AppContent id="saved" onScroll={ ::this.handleScroll }>
                    <ArticleView articles={_.slice(props.list.articles,0,((this.state.page+1) * this.pageSize))} preventUpdate />
                    { ::this.renderLoadMore() }
                </AppContent>
            </div>
        );

        return (
            <AltContainer stores={ stores } render={ render } />
        );
    }

    renderLoadMore() {
        var list = ListStore.getSavedList();
        if (list.articles && (this.state.page + 1) * this.pageSize < list.articles.length) {
            return (
                <div className={ Style.footer }>
                    <Button icon='cached' label='Load More' raised primary onClick={ ::this.loadMore }/>
                </div>
            );
        } else {
            return false;
        }
    }
}
