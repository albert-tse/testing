import UserStore from '../stores/User.store';

const actions = {

    openShareDialog(dialogType, article) {
        const role = getUserRole();
        const location = window.location.hash;
        dataLayer.push({
            event: 'ctm.openShareDialog',
            userRole: role,
            dialogType: 'legacy',
            location: location,
            action: `${role} opened ${dialogType} from`,
            label: location
        });
    },

    openArticleView(article) {
        const role = getUserRole();
        const location = window.location.hash;
        dataLayer.push({
            event: 'ctm.openArticleView',
            userRole: role,
            location: location,
            action: `${role} opened Article View from`,
            label: location
        });
    }

};

const getUserRole = () => {
    const { role } = UserStore.getState().user;
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.substr(1)).join(' ');
}

export default actions;
