import alt from '../alt'; 

class HeaderActions {
    constructor() {
        this.generateActions('setTitle');
    }
}

export default alt.createActions(HeaderActions);
