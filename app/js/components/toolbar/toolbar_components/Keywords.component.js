import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { IconButton, Input } from 'react-toolbox';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import SearchStore from '../../../stores/Search.store';
import SearchActions from '../../../actions/Search.action';
import { bordered, clearEntry, keywordsBox } from './styles.keywords';
import classnames from 'classnames';
import { pushEvent } from '../../shared/Analytics.component';

export default class Keywords extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.performSearch = this.performSearch.bind(this);
        this.update = this.update.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.state = {
            text: FilterStore.getState().text,
            placeholder: props.placeholder ? props.placeholder : 'Search'
        };
    }

    componentDidMount() {
        this.state.text = FilterStore.getState().text;
    }

    render() {
        return (
            <Input
                className={classnames(bordered, keywordsBox)}
                type="text"
                label="Search"
                icon={this.state.text.length > 0 ? <IconButton className={clearEntry} primary icon="clear" onClick={this.clearSearch} /> : 'search'}
                value={this.state.text}
                onKeyPress={this.performSearch}
                onChange={this.update}
                placeholder={this.state.placeholder}
            />
        );
    }

    performSearch(evt, onClear) {
        if (evt.key === 'Enter' || (typeof onClear !== 'undefined' && onClear)) {
            FilterActions.update(this.state);
            pushEvent(this.state);
            SearchActions.getResults();
        } else {
            return false;
        }
    }

    update(newValue, callback) {
        if (typeof callback === 'function') {
            this.setState({
                text: newValue
            }, callback);
        } else {
            this.setState({ text: newValue });
        }
    }

    clearSearch(evt) {
        this.update('', () => 
            this.performSearch(evt, true)
        );
    }
}
