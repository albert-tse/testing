import React, { Component, PropTypes } from 'react';
import { IconButton } from 'react-toolbox';
import { without } from 'lodash';

import SecondaryMenu, { options } from './SecondaryMenu.component';
import Styles from './styles.search';

export default class Search extends Component {

    constructor(props) {
        super(props);
        this.toggleSearchDialog = this.toggleSearchDialog.bind(this);
        this.state = {
            showSearchDialog: false
        };
    }

    render() {
        return (
            <div className={Styles.searchBar} onClick={this.toggleSearchDialog}>
                <IconButton className={Styles.searchIcon} icon="search" />
                <p className={Styles.searchText}>Search topics and keywords...</p>
                <SecondaryMenu options={without(options, 'select')} />
            </div>
        );
    }

    toggleSearchDialog(evt) {
        this.setState({ showSearchDialog: !this.state.showSearchDialog });
    }
}

Search.propTypes = {
};

export default Search;
