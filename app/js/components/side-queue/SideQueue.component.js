import React from 'react';

import Queue from '../queue';
import Styles from './styles';

function SideQueueComponent(props) {
    return (
        <div className={Styles.container}>
            <Queue />
        </div>
    )
}

export default SideQueueComponent;
