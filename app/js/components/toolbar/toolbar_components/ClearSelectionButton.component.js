import React, { Component } from 'react';
import { IconButton } from 'react-toolbox';
import AltContainer from 'alt-container';

import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';

import Styles from '../styles';

const ClearSelectionButton = props => (
    <AltContainer
        actions={ FilterActions }
        component={Contained}
        shouldComponentUpdate={ (prevProps, container, nextProps) => prevProps.selectedArticles.length !== nextProps.selectedArticles.length }
        stores={{
            selectedArticles: props => ({
                store: FilterStore,
                value: FilterStore.getState().ucids
            })
        }}
    />
);

class Contained extends Component {
    constructor(props) {
        super(props);
        this.clearSelectedArticles = this.clearSelectedArticles.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keyup', this.clearSelectedArticles);
    }

    componentWillUnmount() {
        window.removeEventListener('keyup', this.clearSelectedArticles);
    }

    render() {
        return (
            <div className={Styles.actionsContainer}>
                <IconButton icon="clear" onClick={this.props.clearSelection} />
                <h1 className={Styles.title}>{ this.props.selectedArticles.length } Selected</h1>
            </div>
        );
    }

    clearSelectedArticles({ key }) {
        return key === 'Escape' && this.props.clearSelection();
    }
    
}

export default ClearSelectionButton;
