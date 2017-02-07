import alt from '../alt';
import { defer } from 'lodash';
import Config from '../config';
import History from '../history';

import NotificationStore from '../stores/Notification.store';
import ShareDialogSource from '../sources/ShareDialog.source';
import ShareDialogActions from '../actions/ShareDialog.action';
import LinkActions from '../actions/Link.action';

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

    onEdit(payload) {
        this.setState({
            isActive: true,
            isEditing: true,
            ...payload
        });
    }

    onClose() {
        this.setState(BaseState);
    }

    onSchedule(requests) {
        requests.forEach(request => {
            if (this.isEditing) {
                this.getInstance().edit(request);
            } else {
                this.getInstance().schedule(request);
            }
        });
    }

    onDeschedule(post) {
        this.getInstance().deschedule(post);
    }

    onScheduling() {
        this.setState({
            isActive: false
        });
    }

    onScheduledSuccessfully(response) {
        this.setState({
            isEditing: false
        });

        defer(NotificationStore.add, {
            label: 'Scheduled story successfully',
            action: 'Go to Links',
            callback: History.push.bind(this, Config.routes.links)
        });

        defer(LinkActions.fetchLinks);
    }

    onDescheduledSuccessfully(response) {
        this.setState({
            isEditing: false
        });

        defer(NotificationStore.add, {
            label: 'Successfully removed schedule from story',
            action: 'Go to Links',
            callback: History.push.bind(this, Config.routes.links)
        });

        defer(LinkActions.fetchLinks);
    }
}

const BaseState = {
    isActive: false,
    isEditing: false,
    shortlink: '',
    link: {}
};

export default alt.createStore(ShareDialogStore, 'ShareDialogStore');
