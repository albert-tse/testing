class NotificationActions {

    //showANewNotification
    add(notificationData) {
        this.dispatch(notificationData);
    }

    //Dismiss a notification
    dismiss(notificationData) {
        this.dispatch(notificationData);
    }

    // Handles the click event on the action button (default: DISMISS)
    onClick() {
        this.dispatch();
    }

}

export default alt.createActions(NotificationActions);

//For actions we will perform our imports last. If we do this first it tends to create dependency loops. 
import alt from '../alt';
