import React, { Component, PropTypes } from 'react';
import { IconButton } from 'react-toolbox';
import { without } from 'lodash';

import Config from '../../../config';
import History from '../../../history';
import FilterActions from '../../../actions/Filter.action';
import SearchActions from '../../../actions/Search.action';

import SecondaryMenu, { options } from './SecondaryMenu.component';
import Styles from './styles.search';

class Search extends Component {

    constructor(props) {
        super(props);
        this.toggleSearchDialog = this.toggleSearchDialog.bind(this);
        this.updateKeywords = this.updateKeywords.bind(this);
        this.submit = this.submit.bind(this);
        this.clearKeywords = this.clearKeywords.bind(this);
        this.state = Search.baseState;
    }

    render() {
        return (
            <div className={Styles.searchBar} onClick={this.toggleSearchDialog}>
                <IconButton className={Styles.searchIcon} icon="search" />
                <input className={Styles.searchText}
                    placeholder="Search topics and keywords..."
                    value={this.state.text}
                    onChange={this.updateKeywords}
                    onKeyUp={this.submit}
                />
                {this.state.text === Search.baseState.text ? 
                    <SecondaryMenu options={without(options, 'select')} /> :
                    <IconButton icon="clear" onClick={this.clearKeywords} />
                }
            </div>
        );
    }

    clearKeywords() {
        this.setState({ text: Search.baseState.text });
    }

    toggleSearchDialog(evt) {
        this.setState({ showSearchDialog: !this.state.showSearchDialog });
    }

    updateKeywords(evt) {
        this.setState({ text: evt.target.value });
    }

    submit(evt) {
        if (/enter/i.test(evt.key) && this.state.text.length > 0) {
            FilterActions.update(this.state);
            SearchActions.getResults();
            History.push(Config.routes.search);
        }
    }
}

Search.propTypes = {
};

Search.baseState = {
    text: '',
    showSearchDialog: false
};

export default Search;
