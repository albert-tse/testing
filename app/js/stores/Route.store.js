import alt from '../alt'
import RouteActions from '../actions/Route.action'

class RouteStore {

    constructor() {
        this.currentRoute = '/';

        this.bindListeners({
            handleRouteChanged: RouteActions.CHANGED
        });
    }

    handleRouteChanged(route) {
        var newState = {
            currentRoute: route
        }

        this.setState(newState);
    }

}

export default alt.createStore(RouteStore, 'RouteStore');
