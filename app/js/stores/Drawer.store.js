import alt from '../alt'
import DrawerActions from '../actions/Drawer.action';

class DrawerStore {

    constructor() {
        this.state = {
            isActive: false
        };

        this.bindActions(DrawerActions);
    }

    onToggle() {
        this.setState({
            isActive: !this.isActive
        });
    }

}

//We need to create the store before we can bootstrap it
export default alt.createStore(DrawerStore, 'DrawerStore');
