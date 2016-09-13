import alt from '../alt';
import NotificationActions from '../actions/Notification.action';

import React from 'react';
import { Button, IconButton } from 'react-toolbox';

const defaults = {
    action: 'dismiss',
    type: 'cancel',
    timeout: 60000,
    onTimeout: NotificationActions.dismiss
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
        payload = typeof payload !== 'string' ? payload : { label: payload, action: 'nobutton' };
        Object.assign(payload, defaults, {
            label: (
                <span>
                    {payload.label}
                    {payload.action !== 'nobutton' && (
                        <Button 
                            flat 
                            label={payload.action} 
                            onClick={this.onClick.bind(this, true)} 
                        />
                    )}
                </span>
            ),
            action: <span className="material-icons">highlight_off</span>,
            type: 'cancel'
        });

        this.setState({
            active: true,
            queue: [...this.queue, payload]
        });
    }

    onClick(triggerCallback) {
        var notification = this.queue[0];

        if ('callback' in notification && triggerCallback) {
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
