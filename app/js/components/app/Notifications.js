import React, { Component } from 'react'
import AltContainer from 'alt-container';
import { Snackbar } from 'react-toolbox';
import NotificationStore from '../../stores/Notification.store'
import NotificationActions from '../../actions/Notification.action'
import Styles from './styles.notifications';

class Notifications extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={Snackbar}
                store={NotificationStore}
                actions={NotificationActions}
                transform={ props => {
                    var hasNotification = props.queue.length > 0;
                    var notification = hasNotification ? props.queue[0] : {};
                    return {
                        ...props,
                        ...notification,
                        className: Styles.constrainWidth
                    };
                }}
            />
        );
    }
}

export default Notifications;
