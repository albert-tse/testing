import alt from '../alt';
import AppActions from '../actions/App.action';

class PublisherActions {
    
    gotBudgetSummary(payload) {
        this.dispatch(payload);
    }

    getBudgetSummaryError(error) {
        console.error('Error loading publisher click summary', error);
    }
}

export default alt.createActions(PublisherActions);

