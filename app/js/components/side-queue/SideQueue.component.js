import React from 'react';

import Queue from '../queue';
import Styles from './styles';

function SideQueueComponent({
    isProfileSelected
}) {
    return (
        <div className={Styles.container}>
            {isProfileSelected ? <Queue mini /> : <CTAToAddProfiles />}
        </div>
    );
}

function CTAToAddProfiles(props) {
    return (
        <div>Add profile to show scheduling timeslots</div>
    );
}

export default SideQueueComponent;
