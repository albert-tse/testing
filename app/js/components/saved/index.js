import React from 'react';
import AltContainer from 'alt-container';
import { Button } from 'react-toolbox/lib/button';
import ListStore from '../../stores/List.store';
import ListActions from '../../actions/List.action';
import { AppContent, ArticleView } from '../shared';
import { SavedToolbar } from '../toolbar';
import Config from '../../config';
import History from '../../history';
import Style from './style';
import Typography from '../../../scss/typography';
import thumbnail from '../../../static/thumbnail.png';

export default class Saved extends React.Component {

    pageSize = 25

    constructor(props) {
        super(props);
        this.state = {
            page: 0
        };
    }

    componentWillMount() {
        ListActions.getSavedList();
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
                    <ArticleView 
                        articles={_.slice(props.list.articles,0,((this.state.page+1) * this.pageSize))} 
                        preventUpdate 
                        emptyState={this.renderEmpty}
                    />
                    { ::this.renderLoadMore() }
                </AppContent>
            </div>
        );

        return (
            <AltContainer stores={ stores } render={ render } />
        );
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

    renderEmpty() {
        return (
            <div className={Style.emptyState}>
                <h2 className={Typography.emptyStateCallToAction}>You don't have any stories saved.</h2>
                <h2 className={Typography.emptyStateCallToAction}>To save a story click on the bookmark on any post.</h2>
                <img className={Style.thumbnail} src={thumbnail} />
                <Button
                    className={Style.exploreContempoButton}
                    label="GOT IT. EXPLORE CONTEMPO" 
                    onClick={History.push.bind(this, Config.routes.explore)} 
                />
            </div>
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
