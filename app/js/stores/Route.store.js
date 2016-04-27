import alt from '../alt'
import Config from '../config/'

class RouteStore {

    constructor() {
        this.currentRoute = Config.routes.default;

        this.exportPublicMethods({
            changeRoute: this.changeRoute.bind(this)
        });
    }

    handleRouteChanged(route) {
        var newState = {
            currentRoute: route
        }

        this.setState(newState);
    }

    changeRoute(route) {
        this.currentRoute = route;
    }

}

export default alt.createStore(RouteStore, 'RouteStore');
