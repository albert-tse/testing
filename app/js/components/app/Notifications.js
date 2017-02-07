import React, { Component } from 'react'
import AltContainer from 'alt-container';
import { Snackbar, Button } from 'react-toolbox';
import NotificationStore from '../../stores/Notification.store'
import NotificationActions from '../../actions/Notification.action'
import Styles from './styles.notifications';
import Theme from './style.theme.snackbar';

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
                        className: Styles.constrainWidth,
                        theme: Theme
                    };
                }}
            />
        );
    }
}

export default Notifications;
