import React from 'react';
import { Button } from 'react-toolbox';

import Config from '../../config';
import Styles from './styles';
import History from '../../history';

function CTAToEditSchedule(props) {
    return (
        <div className={Styles.ctaBody}>
            <h2 className={Styles.ctaHeading}>Did you know you can add timeslots to your profile</h2>
            <div className={Styles.ctaButtonGroup}>
                <Button raised accent label="Edit Schedule" onClick={goToEditSchedule} />
            </div>
        </div>
    )
}

function goToEditSchedule(evt) {
    evt.stopPropagation();
    History.push(Config.routes.schedules)
}

export default CTAToEditSchedule;
