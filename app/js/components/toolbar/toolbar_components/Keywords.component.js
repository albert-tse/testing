import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Input } from 'react-toolbox';
import FilterActions from '../../../actions/Filter.action';
import SearchStore from '../../../stores/Search.store';
import SearchActions from '../../../actions/Search.action';

export default class Keywords extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
    }

    render() {
        return (
            <AltContainer
                actions={ props => ({
                    onBlur: ::this.performSearch,
                    onKeyPress: evt => evt.key === 'Enter' && this.performSearch(),
                    onChange: newValue => {
                        this.setState({
                            text: newValue
                        });
                    },
                })}
                >
                <Input type="text" label="Search" icon="search" value={this.state.text} />
            </AltContainer>
        );
    }

    performSearch() {
        FilterActions.update(this.state);
        SearchActions.getResults();
    }
}
