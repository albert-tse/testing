import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import ListActions from '../../../actions/List.action';

export default class ClearSavedArticlesButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Button
                icon="clear_all"
                label="Clear All"
                onClick={ListActions.clearSavedList}
            />
        );
    }
}
