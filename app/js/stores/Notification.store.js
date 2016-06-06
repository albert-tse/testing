import alt from '../alt';
import NotificationActions from '../actions/Notification.action';

const defaults = {
    action: 'dismiss',
    type: 'cancel'
};

const BaseState = {
    active: false,
    queue: []
};

class NotificationStore {

    constructor() {
        Object.assign(this, BaseState);
        this.bindActions(NotificationActions);
        this.bindListeners({
            onClick: NotificationActions.ON_CLICK
        });
        this.exportPublicMethods({
            dismiss: ::this.onDismiss,
            add: ::this.onAdd
        });
    }

    onDismiss() {
        this.dequeue();
    }

    onAdd(payload) {
        console.log(payload);
        payload = typeof payload !== 'string' ? payload : { label: payload };
        payload = Object.assign({}, defaults, payload);

        this.setState({
            active: true,
            queue: [...this.queue, payload]
        });
    }

    onClick() {
        var notification = this.queue[0];

        if ('callback' in notification) {
            notification.callback.call(this)
        }

        this.dequeue();

    }

    dequeue() {
        this.setState({ active: false });
        return _.delay(::this.showNext, 1000);
    }

    showNext() {
        this.queue.shift();
        if (this.queue.length > 0) {
            this.setState({ active: true });
        }
    }

}

export default alt.createStore(NotificationStore, 'NotificationStore');
