import React from 'react';
import { Button } from 'react-toolbox';
import { compose, pure, withHandlers } from 'recompose';
import { curry } from 'lodash';

import Config from '../../config';

import Styles from './styles';

function CTAToAddProfiles({
    goToManageAccounts
}) {
    return (
        <div className={Styles.addProfileCTA}>
            <h2 className={Styles.addProfileCTAHeading}>Want to schedule your post?</h2>
            <p className={Styles.message}>Manage and schedule your posts to Facebook and Twitter directly from Contempo! Connect as many pages or profiles as you like.</p>
            <Button raised accent label="Connect Your Profile" onClick={goToManageAccounts} />
        </div>
    );
}

function goToManageAccountsHandler(props, evt) {
    window.open('/#' + Config.routes.manageAccounts);
    evt.stopPropagation();
}

const handlers = {
    goToManageAccounts: curry(goToManageAccountsHandler)
}

export default withHandlers(handlers)(CTAToAddProfiles);
