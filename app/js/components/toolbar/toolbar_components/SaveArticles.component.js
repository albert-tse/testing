import React, { Component } from 'react';
import CollapsibleButton from './CollapsibleButton.component';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import ListActions from '../../../actions/List.action';
import ListStore from '../../../stores/List.store';

export default class SaveArticles extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CollapsibleButton icon="bookmark_border" label={this.props.label || "Save All"} onClick={::this.saveSelectedArticlesToSavedList} />
        );
    }

    saveSelectedArticlesToSavedList() {
        var selectedArticles = FilterStore.getState().ucids;

        if (selectedArticles.length > 0) {
            var savedArticles = ListStore.getSavedList().articles.map(article => article.ucid);
            var alreadySaved = selectedArticles.filter(ucid => savedArticles.indexOf(ucid) >= 0);
            var shouldSave = alreadySaved.length / selectedArticles.length < .5;

            shouldSave ? ListActions.addToSavedList(selectedArticles) : ListActions.removeFromSavedList(selectedArticles);
            FilterActions.clearSelection();
        }
    }
}
