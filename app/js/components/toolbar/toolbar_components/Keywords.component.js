import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { IconButton, Input } from 'react-toolbox';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import SearchStore from '../../../stores/Search.store';
import SearchActions from '../../../actions/Search.action';
import { bordered, clearEntry } from './styles.keywords';

export default class Keywords extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            text: FilterStore.getState().text
        };
    }

    componentDidMount(){
        this.state.text = FilterStore.getState().text;
    }

    render() {
        return (
            <Input
                className={bordered}
                type="text"
                label="Search"
                icon={this.state.text.length > 0 ? <IconButton className={clearEntry} primary icon="clear" onClick={() => this.update('')} /> : 'search'}
                value={this.state.text}
                onKeyPress={::this.performSearch}
                onChange={::this.update}
            />
        );
    }

    performSearch(evt) {
        if (evt.key === 'Enter') {
            FilterActions.update(this.state);
            SearchActions.getResults();
        } else {
            return false;
        }
    }

    update(newValue) {
        this.setState({
            text: newValue
        });
    }
}
