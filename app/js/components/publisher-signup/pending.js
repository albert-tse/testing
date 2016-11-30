import React, { Component } from 'react';
import moment from 'moment'; 
import _ from 'lodash';
import classnames from 'classnames';

import History from '../../history';
import config from '../../config';

import UserStore from '../../stores/User.store';
import UserActions from '../../actions/User.action';

import Style from './style';

/**
 * Publisher Pending View
 * This view is show to Publishers who have not been approved yet. 
 * When unapproved a publisher is not allowed to do anything except view this page.
 * This page has no functionality, however will rely on the automated user refresh 
 * logic to wait for changes to the user store. 
 */
export default class Pending extends Component {

    /**
     * @constructor
     */
    constructor(props) {
        super(props);
    }

    //Component should never update

    /**
     * Display the pending message to the user
     */
    render() {
        return (
            <div id="signup" className="send-to-back">
                <Header className="extended with-cover" />
                <div className="container">
                    <div className="jumbotron">
                        <div className="page-header">
                            <h1>
                                Terms of Service<br />
                                <small>We have updated our Terms of Service, please accept the below terms to continue.</small> 
                            </h1> 
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}