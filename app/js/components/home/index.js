import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import Joyride from 'react-joyride';

import UserStore from '../../stores/User.store';
import UserActions from '../../actions/User.action';
import ListActions from '../../actions/List.action';

import Config from '../../config';
import AppContent from '../shared/AppContent/AppContent.component';
import ArticleDialogs from '../shared/article/ArticleDialogs.component';
import ListPreview from './ListPreview';

/** Represents the Home view, which features highlighted stories or recently saved stories */
export default class Home extends Component {

    /**
     * Set up the component's initial state and
     * bind callback methods to this instance
     * @param {object} props currently is not being used
     * @return {Component} the view itself
     */
    constructor(props) {
        super(props);

        // Bind callback instance methods
        this.previewArticle = this.previewArticle.bind(this);
        this.renderListPreview = this.renderListPreview.bind(this);;
        this.resetPreviewArticle = this.resetPreviewArticle.bind(this);

        // Set the initial state
        this.state = {
            steps: [],
            previewArticle: null
        };
    }

    /** Load user-created lists */
    componentWillMount() {
        ListActions.loadMyLists();
    }

    /** Show onboarding steps if this is the User's first time here */
    componentDidMount() {
        if (!UserStore.getState().completedOnboardingAt.home) {
            setTimeout(() => {
                this.addSteps(Config.onboardSteps);
            }, 5000);
            this.joyride.start();
        }
    }

    /**
     * Render the component
     * @return {JSX} the component
     */
    render() {
        return (
            <AppContent withoutToolbar>
                {Config.listsOnHome.map(this.renderListPreview)}
                <Joyride 
                    ref={c => (this.joyride = c)}
                    steps={this.state.steps}
                    callback={this.nextStep}
                    debug={false}
                    type="continuous"
                />
                <ArticleDialogs
                    previewArticle={this.state.previewArticle}
                    resetPreviewArticle={this.resetPreviewArticle}
                />
            </AppContent>
        );
    }

    /**
     * Partial for rending a list preview
     * @param {object} list contains the list id needed to fetch from server the stories that belong to this list
     * @param {int} index of this particular element as a it belongs to an array
     * @return {JSX} the list preview component
     */
    renderListPreview(list, index) {
        return React.createElement(ListPreview, {
            key: index,
            overrides: list.overrides,
            listId: list.type === 'static' && list.id,
            specialList: list.type === 'special' && list.name,
            listObj: list.type === 'object' && list.object,
            previewArticle: () => this.previewArticle
        });
    }

    /**
     * This is called when a User clicks/taps on a story to view
     * more details
     * @param {object} article that was chosen
     */
    previewArticle(article) {
        this.setState({ previewArticle: article });
    }

    /** Reset the state without an article */
    resetPreviewArticle() {
        this.setState({ previewArticle: null });
    }

    /**
     * Adds an onboarding step or multiple steps to the Joyride component
     * @param {array|object} steps can either be an object representing one step or an array representing a series of steps
     */
    addSteps(steps) {
        let joyride = this.joyride;

        if (!Array.isArray(steps)) {
            steps = [steps];
        }

        if (!steps.length || !joyride) {
            return false;
        }

        this.setState({ steps: [...this.state.steps, ...joyride.parseSteps(steps)] });
    }

    /**
     * Callback function is called whenever the User interacts with Joyride
     * @param {object} untitled contains which part of the Joyride UI the User interacted with
     */
    nextStep({ action, type }) {
        if (action === 'next' && type == 'finished') {
            UserActions.completedOnboarding({ home: true });
        }
    }
}
