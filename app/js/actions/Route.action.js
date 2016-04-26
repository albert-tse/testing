class RouteActions {

    //Signify that we should check for auth credentials
    //If no credentials are provided, we will look for stored credentials
    changed(route) {
        this.dispatch(route);
    }

}

export default alt.createActions(RouteActions);

//For actions we will perform our imports last. If we do this first it tends to create dependency loops. 
import alt from '../alt';
