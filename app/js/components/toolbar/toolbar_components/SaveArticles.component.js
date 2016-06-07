import React, { Component } from 'react';
import { IconButton } from 'react-toolbox';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import ListActions from '../../../actions/List.action';

export default class SaveArticles extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <IconButton icon="bookmark_border" onClick={::this.saveSelectedArticlesToSavedList} />
        );
    }

    saveSelectedArticlesToSavedList() {
        var articlesToSave = FilterStore.getState().ucids;
        articlesToSave.length > 0 && ListActions.addToSavedList(articlesToSave);
        FilterActions.clearSelection();
    }
}
