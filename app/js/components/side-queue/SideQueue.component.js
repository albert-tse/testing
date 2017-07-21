import React from 'react';
import { Button } from 'react-toolbox';
import classnames from 'classnames';
import { pure } from 'recompose';

import Queue from '../queue';
import { CTAToAddProfiles } from '../null-states';
import Styles from './styles';

function SideQueueComponent({
    isProfileSelected,
    scheduledDate
}) {
    return (
        <div className={classnames(Styles.container, !isProfileSelected && Styles.centered)}>
            {isProfileSelected ? <Queue mini /> : <CTAToAddProfiles />}
        </div>
    );
}


export default pure(SideQueueComponent);
