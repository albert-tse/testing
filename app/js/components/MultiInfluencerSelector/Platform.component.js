import React, { Component, PropTypes } from 'react';
import { ListItem } from 'react-toolbox';
import { pick } from 'lodash';

import NoAvatar from '../NoAvatar.component';
import Styles from './styles';

export default class Platform extends Component {

    constructor(props) {
        super(props);
        this.toggleSelected = this.toggleSelected.bind(this);
        this.state = {
            selected: false
        };
    }

    componentDidMount() {
        this.onChange = this.props.onChange;
    }

    componentDidUpdate() {
        this.onChange = this.props.onChange;
    }

    render() {
        /*avatar={this.state.selected ? <NoAvatar value={this.props.name} /> : this.props.avatar }*/

        return (
            <ListItem
                className={!this.state.selected ? Styles.dimmed : ''}
                avatar={this.props.avatar}
                caption={this.props.name}
                legend={this.props.type}
                onClick={this.toggleSelected}
                onChange={this.onChange}
            />
        );
    }

    toggleSelected(evt) {
        this.setState({ selected: !this.state.selected }, () => {
            this.onChange({
                selected: this.state.selected,
                platform: pick(this.props, 'id', 'name', 'avatar', 'type') // TODO: Just return the platform ID would be fine
            });
        });
    }
}
