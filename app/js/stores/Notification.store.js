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
            this.notifications.push({
                message: input,
                key: (new Date()).getTime(),
                isActive: true,
                dismissAfter: 6000
            });
        } else {
            if (!input.key) {
                input.key = (new Date()).getTime();
            }
            this.notifications.push(input);
        }

        this.setState({
            notifications: this.notifications
        });
    }
}

export default alt.createStore(NotificationStore, 'NotificationStore');
