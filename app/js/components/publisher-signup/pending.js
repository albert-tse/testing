import React, { Component } from 'react';
import moment from 'moment'; 
import _ from 'lodash';
import classnames from 'classnames';

import History from '../../history';
import config from '../../config';
import Analytics from '../shared/Analytics.component';
import { jumbotron, overlay, container, twoColumns } from '../common';

import UserStore from '../../stores/User.store';
import UserActions from '../../actions/User.action';

import Styles from './style';

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
            <div id="pending" className={Styles.sendToBack, Styles.scrollable}>
                <Analytics />
                <div className='with-cover'>
                    <div className={overlay}>
                        <div className='container'>
                            <div className={jumbotron}>
                                <h1 className={Styles.brand}>Contempo</h1>
                                <h2>Thanks for signing up!</h2>
                                <p>
                                    Your publisher account is currently being reviewed. We will contact you shortly to finalize your account.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}