import alt from '../alt';
import API from '../api';
import Config from '../config';
import ShareDialogActions from '../actions/ShareDialog.action';
import AuthStore from '../stores/Auth.store'

const ShareDialogSource = {
    schedule() {
        return {
            remote(state, request) {
				const token = AuthStore.getState().token;
                return API.post(`${Config.apiUrl}/scheduler/posts?token=${token}`, request).then(response => response.data);
            },

            success: ShareDialogActions.scheduledSuccessfully,
            loading: ShareDialogActions.scheduling,
            error: ShareDialogActions.errorScheduling,
        };
    }
};

export default ShareDialogSource;
