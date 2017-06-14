import React from 'react';
import { Button } from 'react-toolbox';
import classnames from 'classnames';

import Queue from '../queue';
import Styles from './styles';

function SideQueueComponent({
    goToManageAccounts,
    isProfileSelected
}) {
    return (
        <div className={classnames(Styles.container, !isProfileSelected && Styles.centered)}>
            {isProfileSelected ? <Queue mini /> : <CTAToAddProfiles onClick={goToManageAccounts} />}
        </div>
    );
}

function CTAToAddProfiles({
    onClick
}) {
    return (
        <div className={Styles.addProfileCTA}>
            <h2 className={Styles.addProfileCTAHeading}>Want to schedule your post?</h2>
            <p className={Styles.message}>Manage and schedule your posts to Facebook and Twitter directly from Contempo! Connect as many pages or profiles as you like.</p>
            <Button raised accent label="Connect Your Profile" onClick={onClick()} />
        </div>
    );
}

export default SideQueueComponent;
