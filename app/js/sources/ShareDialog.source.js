import alt from '../alt';
import API from '../api';
import Config from '../config';
import ShareDialogActions from '../actions/ShareDialog.action';
import AuthStore from '../stores/Auth.store'
import LinkStore from '../stores/Link.store';

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
    },

    edit() {
        return {
            remote(state, request) {
                const token = AuthStore.getState().token;
                return API.put(`${Config.apiUrl}/scheduler/posts/${request.editPostId}?token=${token}`, request).then(response => response.data);
            },

            success: ShareDialogActions.scheduledSuccessfully,
            loading: ShareDialogActions.scheduling,
            error: ShareDialogActions.errorScheduling,
        };
    },

    deschedule() {
        return {
            remote(state, scheduledPostId) {
                const token = AuthStore.getState().token;
                return API.delete(`${Config.apiUrl}/scheduler/posts/${scheduledPostId}?token=${token}`).then(response => response.data);
            },

            success: ShareDialogActions.descheduledSuccessfully,
            error: ShareDialogActions.errorScheduling,
        };
    }
};

export default ShareDialogSource;
