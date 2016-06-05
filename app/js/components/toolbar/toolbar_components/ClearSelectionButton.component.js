import React, { Component } from 'react';
import AltContainer from 'alt-container';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import { IconButton } from 'react-toolbox';
import Styles from '../styles';

export default class ClearSelectionButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                actions={ FilterActions }
                stores={{
                    selectedArticles: props => ({
                        store: FilterStore,
                        value: FilterStore.getState().ucids
                    })
                }}
                render={ props => (
                    <div className={Styles.actionsContainer}>
                        <IconButton icon="clear" onClick={props.clearSelection} />
                        <p className={Styles.title}>{ props.selectedArticles.length } Selected</p>
                    </div>
                )}
            />
        );
    }
}
