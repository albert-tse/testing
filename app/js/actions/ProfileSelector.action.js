import alt from '../alt';
import ProfileStore from '../stores/Profile.store';
import UserStore from '../stores/User.store';

/**
 * Profile Selector actions
 * They are most likely going to be called only from the Profile Selector component
 * Any user interactions with the component must go through this action dispatcher
 * @return {ProfileSelectorActions}
 */
class ProfileSelectorActions {

    selectProfile(profile) {
        this.dispatch(profile);
    }

    deselectProfile(profile) {
        this.dispatch(profile);
    }

    searchProfiles(keywords) {
        this.dispatch(keywords);
    }
}

export default alt.createActions(ProfileSelectorActions);
