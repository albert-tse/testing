import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import AltContainer from 'alt-container';
import { Input } from 'react-toolbox';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import SearchStore from '../../../stores/Search.store';
import SearchActions from '../../../actions/Search.action';

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
            <AltContainer
                actions={ props => ({
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
