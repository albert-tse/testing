import React, { Component, PropTypes } from 'react';
import { ListSubHeader } from 'react-toolbox';
import Profile from './Profile.component';
import { omit } from 'lodash';
import classnames from 'classnames';

import Styles from './styles';

/**
 * Represents a collapsible component for a specific influencer and corresponding profiles
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
        this.onProfileChange = this.onProfileChange.bind(this);
        this.onInfluencerChange = this.props.onChange;
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.state = {
            collapsed: false,
            ...omit(props, 'onChange')
        };
    }

    componentWillReceiveProps() {
        this.setState({
            ...omit(this.props, 'onChange')
        });
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
                    {this.props.profiles.map(profile => (
                        <Profile
                            key={profile.id}
                            onChange={this.onProfileChange}
                            {...profile}
                        />
                    ))}
                </div>
            </div>
        );
    }

    /**
     * Update influencer state when one of the profiles is [de]selected
     * Once updated, update parent element
     * @param {Object} profile that was recently [de]selected
     */
    onProfileChange(profile) {
        let updatedProfiles = this.state.profiles.filter(p => p.id !== profile.id);
        updatedProfiles = [
            ...updatedProfiles,
            profile
        ];

        this.setState({
            ...this.state,
            profiles: updatedProfiles
        }, this.onChange);
    }

    /**
     * Update the parent element with new state
     */
    onChange() {
        this.onInfluencerChange && this.onInfluencerChange(omit(this.state, 'collapsed'));
    }

    /**
     * Toggle displaying profiles
     */
    toggleCollapse() {
        this.setState({ collapsed: !this.state.collapsed });
    }
}
