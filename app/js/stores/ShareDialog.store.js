import alt from '../alt';
import ShareDialogActions from '../actions/ShareDialog.action';

class ShareDialogStore {

    constructor() {
        Object.assign(this, BaseState);
        this.bindActions(ShareDialogActions);
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
}

const BaseState = {
    isActive: false,
    shortlink: '',
    link: {}
};

export default alt.createStore(ShareDialogStore, 'ShareDialogStore');
