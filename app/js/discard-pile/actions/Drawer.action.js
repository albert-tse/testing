import alt from '../alt';
import DrawerStore from '../stores/Drawer.store';

class DrawerActions {
    toggle() {
        this.dispatch();
    }
}

export default alt.createActions(DrawerActions);
