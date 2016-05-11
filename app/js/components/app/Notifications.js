import React from 'react'
import { Link } from 'react-router'
import Config from '../../config'
import { NotificationStack } from 'react-notification';

import NotificationActions from '../../actions/Notification.action'
import NotificationStore from '../../stores/Notification.store'

class Notifications extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notifications: NotificationStore.getState().notifications
        };
    }

    componentDidMount() {
        NotificationStore.listen(this.onChange.bind(this));
    }

    componentWillUnmount() {
        NotificationStore.unlisten(this.onChange.bind(this));
    }

    onChange(storeState) {
        var state = this.state;
        state.notifications = storeState.notifications;
        this.setState(state);
    }

    dismiss(notif) {
        NotificationActions.dismiss(notif);
    }

    render() {
        return (
            <NotificationStack notifications = { this.state.notifications } onDismiss = { this.dismiss }></NotificationStack>
        );
    }
}

export default Notifications;
