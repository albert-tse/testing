import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import Joyride from 'react-joyride';

import Config from '../../config';
import ListPreview from './ListPreview';
import ArticleDialogs from '../shared/article/ArticleDialogs.component';
import AppContent from '../shared/AppContent/AppContent.component';

import UserStore from '../../stores/User.store';
import UserActions from '../../actions/User.action';
import ListAction from '../../actions/List.action';

import _ from 'lodash';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.previewArticle = this.previewArticle.bind(this);
        this.renderListPreview = this.renderListPreview.bind(this);;
        this.resetPreviewArticle = this.resetPreviewArticle.bind(this);
        this.state = {
            steps: [],
            previewArticle: null
        };
    }

    componentWillMount() {
        ListAction.loadMyLists();
    }

    componentDidMount() {
        if (!UserStore.getState().completedOnboardingAt.home) {
            setTimeout(() => {
                this.addSteps([
                    {
                        title: 'Curated Posts',
                        text: 'These posts are selected for high performance',
                        selector: '.onboardStep.curated-posts'
                    },
                    {
                        title: 'Share Button',
                        text: 'Click this icon to share this story directly or get a shortlink',
                        selector: 'div[id^="article-"]:first-of-type .onboardStep.share-button'
                    },
                    {
                        title: 'Save Button',
                        text: "Click here if you'd like to save this story for later",
                        selector: 'div[id^="article-"]:first-of-type .onboardStep.save-button'
                    }
                ]);
            }, 5000);
            this.joyride.start();
        }
    }

    render() {
        return (
            <AppContent withoutToolbar>
                {Config.listsOnHome.map(this.renderListPreview)}
                <Joyride ref={c => (this.joyride = c)} steps={this.state.steps} callback={this.nextStep} debug={false} />
                <ArticleDialogs
                    previewArticle={this.state.previewArticle}
                    resetPreviewArticle={this.resetPreviewArticle}
                />
            </AppContent>
        );
    }

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

    previewArticle(article) {
        this.setState({ previewArticle: article });
    }

    resetPreviewArticle() {
        this.setState({ previewArticle: null });
    }

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

    nextStep({ action, type }) {
        if (action === 'close' && type == 'finished') {
            UserActions.completedOnboarding({ home: true });
        }
    }
}
