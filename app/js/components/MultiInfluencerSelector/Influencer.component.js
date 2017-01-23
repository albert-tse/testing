import React, { Component, PropTypes } from 'react';
import { ListSubHeader } from 'react-toolbox';
import Platform from './Platform.component';
import { isEqual } from 'lodash';

export default class Influencer extends Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onPlatformChange = this.onPlatformChange.bind(this);
        this.onInfluencerChange = this.props.onChange;
        this.state = {
            id: this.props.id,
            name: this.props.name,
            selected: []
        };
    }

    render() { 
        return (
            <div>
                <ListSubHeader caption={this.props.name} />
                {this.props.platforms.map(platform => (
                    <Platform 
                        key={platform.name+platform.type}
                        onChange={this.onPlatformChange}
                        {...platform}
                    />
                ))}
            </div>
        );
    }

    onPlatformChange(changes) {
        let newSelected = [];

        if (changes.selected) {
            newSelected = [ changes.platform, ...this.state.selected ];
        } else {
            newSelected = this.state.selected.filter(platform => !isEqual(platform, changes.platform));
        }

        this.setState({ selected: newSelected }, this.onChange);
    }

    onChange() {
        this.onInfluencerChange && this.onInfluencerChange(this.state);
    }
}
