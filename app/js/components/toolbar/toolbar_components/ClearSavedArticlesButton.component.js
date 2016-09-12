import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import ListActions from '../../../actions/List.action';
import { clearAllButton } from './styles.clear-saved-articles-button';

export default class ClearSavedArticlesButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Button
                    className={clearAllButton}
                    icon="clear"
                    label="Clear All"
                    onClick={ListActions.clearSavedList}
                />
            </div>
        );
    }
}
