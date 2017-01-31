import React, { Component, PropTypes } from 'react';
import { ListSubHeader } from 'react-toolbox';
import Platform from './Platform.component';
import { omit } from 'lodash';
import classnames from 'classnames';

import Styles from './styles';

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
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.state = {
            collapsed: false,
            ...omit(props, 'onChange')
        };
    }

    /**
     * Define component
     * @return {JSX}
     */
    render() { 
        return (
            <div>
                <div className={Styles.caption} onClick={this.toggleCollapse}>
                    <i className="material-icons">{'arrow_drop_' + (!this.state.collapsed ? 'down' : 'up')}</i>
                    {this.props.name}
                </div>
                <div className={classnames(this.state.collapsed && Styles.hidden)}>
                    {this.props.platforms.map(platform => (
                        <Platform 
                            key={platform.name+platform.type}
                            onChange={this.onPlatformChange}
                            {...platform}
                        />
                    ))}
                </div>
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
        this.onInfluencerChange && this.onInfluencerChange(omit(this.state, 'collapsed'));
    }

    /**
     * Toggle displaying platforms
     */
    toggleCollapse() {
        this.setState({ collapsed: !this.state.collapsed });
    }
}
