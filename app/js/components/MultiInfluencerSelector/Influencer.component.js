import React, { Component, PropTypes } from 'react';
import { ListSubHeader } from 'react-toolbox';
import Platform from './Platform.component';
import { omit } from 'lodash';

/**
 * Represents a collapsible component for a specific influencer and corresponding platforms
 */
export default class Influencer extends Component {

    /**
     * Create a new influencer component
     * @param {Object} props refer to PropTypes for definitions
     * @return {Influencer} component
     */
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onPlatformChange = this.onPlatformChange.bind(this);
        this.onInfluencerChange = this.props.onChange;
        this.state = {
            ...props
        };
    }

    /**
     * Define component
     * @return {JSX}
     */
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

    /**
     * Update influencer state when one of the platforms is [de]selected
     * Once updated, update parent element
     * @param {Object} platform that was recently [de]selected
     */
    onPlatformChange(platform) {
        let updatedPlatforms = this.state.platforms.filter(p => p.id !== platform.id);
        updatedPlatforms = [
            ...updatedPlatforms,
            platform
        ];

        this.setState({
            ...this.state,
            platforms: updatedPlatforms
        }, this.onChange);
    }

    /**
     * Update the parent element with new state
     */
    onChange() {
        this.onInfluencerChange && this.onInfluencerChange(omit(this.state, 'onChange'));
    }
}
