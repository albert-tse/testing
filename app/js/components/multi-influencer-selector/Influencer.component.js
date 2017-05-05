import React, { Component, PropTypes } from 'react';
import { ListSubHeader } from 'react-toolbox';
import Profile from './Profile.component';
import { defer, omit } from 'lodash';
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
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.state = {
            collapsed: false,
            ...omit(props, 'onChange')
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            ...this.state,
            ...omit(nextProps, 'onChange')
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
                    <i className="material-icons">{!this.state.collapsed ? 'keyboard_arrow_down' : 'chevron_right'}</i>
                    {this.props.name}
                </div>
                <div className={classnames(this.state.collapsed && Styles.hidden)}>
                    {this.props.profiles.map(profile => (
                        <Profile
                            key={profile.id}
                            selectProfile={this.props.selectProfile}
                            deselectProfile={this.props.deselectProfile}
                            {...profile}
                        />
                    ))}
                </div>
            </div>
        );
    }

    /**
     * Toggle displaying profiles
     */
    toggleCollapse() {
        this.setState({ collapsed: !this.state.collapsed });
    }
}
