import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Button, ProgressBar } from 'react-toolbox';
import Joyride from 'react-joyride';
import Style from './style';

import { AppContent, ArticleView } from '../shared';
import { ExploreToolbar } from '../toolbar';

import SearchStore from '../../stores/Search.store';
import FilterStore from '../../stores/Filter.store'

import SearchActions from '../../actions/Search.action';

import { defer, isEqual, pick, without } from 'lodash';

export default class Explore extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillMount() {
        SearchActions.getResults();
    }

    render() {
        return (
            <AltContainer
                component={Contained}
                stores={{
                    search: SearchStore, 
                    filters: FilterStore
                }}
                inject={{
                    isFromSignUp: this.props.route.isFromSignUp
                }}
            />
        );
    }
}

class Contained extends Component {

    constructor(props) {
        super(props);
        this.state = { steps: [] };
    }

    shouldComponentUpdate({ search, filters }, nextState) {
        if (this.props.search.results !== search.results || this.state !== nextState) {
            return true;
        } else {
            let prevFilters = without(Object.keys(this.props.filters), 'influencers', 'permalink');
            prevFilters = pick(this.props.filters, prevFilters);

            let nextFilters = without(Object.keys(filters), 'influencers', 'permalink');
            nextFilters = pick(filters, nextFilters);

            if(!isEqual(prevFilters, nextFilters) && this.props.filters.ucids.length === filters.ucids.length) {
                defer(SearchActions.getResults);
            }
            return false;
        }
    }

    componentDidMount() {
        setTimeout(() => {
            console.log('I will add a new step');
            this.addSteps({
                title: 'Share this story',
                text: 'This will give you options for sharing this article on your social profile',
                selector: "div[id^='article']:first-of-type .share-button"
            });
            this.joyride.start();
        }, 5000);
    }

    render() {
        return (
            <div>
                <Joyride ref={c => this.joyride = c} steps={this.state.steps} debug={true} />
                <ExploreToolbar />
                <AppContent id="explore" onScroll={this.handleScroll}>
                    <ArticleView articles={this.props.search.results} />
                    { this.renderLoadMore(this.props.search) }
                </AppContent>
            </div>
        );
    }

    addSteps(steps) {
        let joyride = this.joyride;

        if (!Array.isArray(steps)) {
            steps = [steps];
        }

        if (!steps.length) {
            return false;
        }

        this.setState({ steps: [...this.state.steps, ...joyride.parseSteps(steps)] });
    }

    handleScroll(event) {
        var target = $(event.target);
        var scrollTopMax = target.prop('scrollHeight') - target.innerHeight();
        var scrollTop = target.scrollTop();
 
        if (scrollTop / scrollTopMax > .75) {
            SearchActions.loadMore();
        }
    }

    renderLoadMore({ isLoadingMore, total_found, start }) {
        if (isLoadingMore) {
            return (
                <div className={ Style.footer }>
                    <ProgressBar type="circular" mode="indeterminate" />
                </div>
            );
        } else if (total_found === start) {
            return false; // XXX No more results to show?
        } else {
            return (
                <div className={ Style.footer }>
                    <Button icon='cached' label='Load More' raised primary onClick={ SearchActions.loadMore }/>
                </div>
            );
        }
    }
}
