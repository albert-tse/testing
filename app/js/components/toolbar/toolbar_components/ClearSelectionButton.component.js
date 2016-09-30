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
    }
}

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
                <p className={Styles.title}>{ this.props.selectedArticles.length } Stories Selected</p>
                <IconButton icon="highlight_off" onClick={this.props.clearSelection} />
            </div>
        );
    }

    clearSelectedArticles({ key }) {
        console.log(key);
        return key === 'Escape' && this.props.clearSelection();
    }
    
}
