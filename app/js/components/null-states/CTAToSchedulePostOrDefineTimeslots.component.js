import React from 'react';
import { Button } from 'react-toolbox';

import Config from '../../config';
import Styles from './styles';
import History from '../../history';

function CTAToSchedulePostOrDefineTimeslots(props) {
    return (
        <div className={Styles.ctaBody}>
            <p className={Styles.ctaHeading}>Looks like you haven't scheduled any posts or time slots.</p>
            <div className={Styles.ctaButtonGroup}>
                {!props.mini && <Button raised accent label="New Post" onClick={goToContentView} />}
                <Button raised accent label="Edit Schedule" onClick={goToEditSchedule} />
            </div>
        </div>
    )
}

function goToContentView(evt) {
    evt.stopPropagation();
    History.push(Config.routes.explore);
}

function goToEditSchedule(evt) {
    evt.stopPropagation();
    History.push(Config.routes.schedules)
}

export default CTAToSchedulePostOrDefineTimeslots;
