import React from 'react';
import { Button } from 'react-toolbox';

import Config from '../../config';
import Styles from './styles';
import History from '../../history';

function CTAToSchedulePostOrDefineTimeslots(props) {
    return (
        <div className={Styles.ctaBody}>
            <h2 className={Styles.ctaHeading}>Looks like you haven't scheduled any posts or time slots.</h2>
            <Button label="New Post" onClick={goToContentView} />
            <Button label="Edit Schedule" onClick={goToEditSchedule} />
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
