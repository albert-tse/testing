import alt from '../alt';
import NotificationActions from '../actions/Notification.action';
import Config from '../config'

class NotificationStore {

    constructor() {
        this.notifications = [];

        this.bindListeners({
            //General Notification Actions
            add: NotificationActions.ADD,
            dismiss: NotificationActions.DISMISS

            //User Settings Notifications

        });


        this.exportPublicMethods({
            dismiss: ::this.dismiss,
            add: ::this.add
        });
    }

    dismiss(notif) {
        this.setState({
            notifications: _.filter(this.notifications, function (el) {
                return notif.key != el.key;
            })
        });
    }

    add(input) {
        if (typeof input === 'string') {
            this.notifications.push(this.createNotification({ message: input }));
        } else {
            this.notifications.push(this.createNotification(input));
        }

        this.setState({
            notifications: this.notifications
        });
    }

    createNotification(input) {
        var payload = Object.assign({
            message: 'Action completed',
            key: (new Date()).getTime(),
            isActive: true,
            dismissAfter: 6000,
            barStyle: {
                fontSize: '1.5rem',
                padding: '2rem'
            },
            actionStyle: {
                color: 'lightblue',
                fontSize: '1.5rem'
            }
        }, input);

        if (typeof input.onClick !== 'undefined') {
            payload.onClick = () => {
                input.onClick();
                this.dismiss(payload);
            }
        }

        return payload;
    }
}

export default alt.createStore(NotificationStore, 'NotificationStore');
