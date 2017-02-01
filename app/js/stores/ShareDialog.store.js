import alt from '../alt';
import { defer } from 'lodash';
import Config from '../config';
import History from '../history';

import NotificationStore from '../stores/Notification.store';
import ShareDialogSource from '../sources/ShareDialog.source';
import ShareDialogActions from '../actions/ShareDialog.action';

class ShareDialogStore {

    constructor() {
        Object.assign(this, BaseState);
        this.bindActions(ShareDialogActions);
        this.registerAsync(ShareDialogSource);
    }

    onOpen(payload) {
        this.setState({
            isActive: true,
            ...payload
        });
    }

    onClose() {
        this.setState(BaseState);
    }

    onSchedule(requests) {
        requests.forEach(request => {
            this.getInstance().schedule(request);
        });
    }

    onScheduling() {
        this.setState({
            isActive: false
        });
    }

    onScheduledSuccessfully(response) {
        defer(NotificationStore.add, {
            label: 'Scheduled story successfully',
            action: 'Go to Links',
            callback: History.push.bind(this, Config.routes.links)
        });
    }
}

const BaseState = {
    isActive: false,
    shortlink: '',
    link: {}
};

export default alt.createStore(ShareDialogStore, 'ShareDialogStore');
