import React, { Component, PropTypes } from 'react';
import { IconButton } from 'react-toolbox';
import { without } from 'lodash';
import FilterActions from '../../../actions/Filter.action';

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
                <input
                    className={Styles.searchText}
                    placeholder="Search topics and keywords..."
                    value={this.state.keywords}
                    onChange={this.updateKeywords}
                    onKeyUp={this.submit}
                />
                {this.state.keywords === Search.baseState.keywords ? 
                    <SecondaryMenu options={without(options, 'select')} /> :
                    <IconButton icon="clear" onClick={this.clearKeywords} />
                }
            </div>
        );
    }

    clearKeywords() {
        this.setState({ keywords: Search.baseState.keywords });
    }

    toggleSearchDialog(evt) {
        this.setState({ showSearchDialog: !this.state.showSearchDialog });
    }

    updateKeywords(evt) {
        this.setState({ keywords: evt.target.value });
    }

    submit(evt) {
        if (/enter/i.test(evt.key) && this.state.keywords.length > 0) {
            FilterActions.update(this.state);
        }
    }
}

Search.propTypes = {
};

Search.baseState = {
    keywords: '',
    showSearchDialog: false
};

export default Search;
