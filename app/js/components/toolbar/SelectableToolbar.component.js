import { Toolbars } from '../toolbar';
import React, { Component } from 'react';
import AltContainer from 'alt-container';
import FilterStore from '../../stores/Filter.store';
import _ from 'lodash';

export default class ExploreToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        if(props.toolbar){
            this.state.toolbar = Toolbars[props.toolbar];
        } else {
            this.state.toolbar = Toolbars.Filter;
        }
    }

    shouldComponentUpdate(nextProps) {
        return this.props.toolbar != nextProps.toolbar;
    }

    componentWillReceiveProps(nextProps){
        if(this.props.toolbar !== nextProps.toolbar){
            if(nextProps.toolbar){
                this.setState({
                    toolbar: Toolbars[nextProps.toolbar]
                });
            } else {
                this.setState({
                    toolbar: Toolbars.Filter
                });
            }
        }
    }

    render() {
        var { Selection } = Toolbars;
        var Toolbar = this.state.toolbar;
        return (
            <AltContainer
                shouldComponentUpdate={ (prevProps, containerProps, nextProps) => {
                    var changeToSelectionMode = prevProps.selectedArticles.length === 0 && nextProps.selectedArticles.length === 1;
                    var changeToFilterMode = prevProps.selectedArticles.length > 0 && nextProps.selectedArticles.length === 0;
                    var filterStyleChanged = prevProps.toolbar != nextProps.toolbar;
                    var shouldUpdate = changeToSelectionMode || changeToFilterMode || filterStyleChanged;
                    return shouldUpdate;
                }}
                stores={{
                    selectedArticles: props => ({
                        store: FilterStore,
                        value: FilterStore.getState().ucids
                    })
                }}
                inject={{
                    toolbar: this.props.toolbar
                }}
                component={ props => props.selectedArticles.length > 0 ? <Selection /> : <Toolbar /> }
            />
        );
    }
}
