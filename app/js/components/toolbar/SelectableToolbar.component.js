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

        if(props.selection){
            this.state.selection = Toolbars[props.selection];
        } else {
            this.state.selection = Toolbars.Selection;
        }

    }

    shouldComponentUpdate(nextProps) {
        return this.props.toolbar != nextProps.toolbar || this.props.selection != nextProps.selection;
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

        if(this.props.selection !== nextProps.selection){
            if(nextProps.selection){
                this.setState({
                    selection: Toolbars[nextProps.selection]
                });
            } else {
                this.setState({
                    selection: Toolbars.Selection
                });
            }
        }
    }

    render() {
        var Selection = this.state.selection;
        var Toolbar = this.state.toolbar;
        return (
            <AltContainer
                shouldComponentUpdate={ (prevProps, containerProps, nextProps) => {
                    var changeToSelectionMode = !Array.isArray(prevProps.selectedArticles) && Array.isArray(nextProps.selectedArticles);
                    var changeToFilterMode = Array.isArray(prevProps.selectedArticles) && !Array.isArray(nextProps.selectedArticles);
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
                component={ props => Array.isArray(props.selectedArticles) ? <Selection /> : <Toolbar /> }
            />
        );
    }
}
