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
                shouldComponentUpdate={ (prevProps, container, nextProps) => prevProps.selectedArticles.length !== nextProps.selectedArticles.length }
                stores={{
                    selectedArticles: props => ({
                        store: FilterStore,
                        value: FilterStore.getState().ucids
                    })
                }}
                render={ props => (
                    <div className={Styles.actionsContainer}>
                        <p className={Styles.title}>{ props.selectedArticles.length } Stories Selected</p>
                        <IconButton icon="highlight_off" onClick={props.clearSelection} />
                    </div>
                )}
            />
        );
    }
}
