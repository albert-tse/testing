import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { IconButton, Input } from 'react-toolbox';
import classnames from 'classnames';
import { debounce } from 'lodash';

import FilterStore from '../../../stores/Filter.store';
import SearchStore from '../../../stores/Search.store';

import FilterActions from '../../../actions/Filter.action';
import SearchActions from '../../../actions/Search.action';

import theme, { bordered, clearEntry, inputForm, keywordsBox } from './styles.keywords';
import { pushEvent } from '../../shared/Analytics.component';

export default class Keywords extends Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.performSearch = debounce(this.performSearch.bind(this), 500);
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
            <section className={inputForm}>
                <IconButton icon={this.state.text.length > 0 ? 'clear' : 'search'} onClick={this.clearSearch} />
                <Input
                    ref={c => this.input = c}
                    value={this.state.text}
                    onChange={this.onChange}
                    onKeyPress={this.performSearch}
                    onChange={this.update}
                    placeholder={this.state.placeholder}
                    theme={theme}
                />
            </section>
        );
    }

    performSearch() {
        FilterActions.update(this.state);
        pushEvent(this.state);
        SearchActions.getResults();
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
            this.performSearch(undefined, true)
        );
    }
}
