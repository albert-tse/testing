import AuthStore from '../stores/Auth.store';
import PublisherActions from '../actions/Publisher.action';
import Config from '../config';
import API from '../api.js';
import moment from 'moment';

const PublisherSource = {
    
    getBudgetSummary() {
        return {
            remote(state, monthOffset) {

                var { token } = AuthStore.getState();

                var DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
                var start = moment().subtract(monthOffset, 'months').startOf('month').format(DATE_FORMAT);
                var end = moment().subtract(monthOffset, 'months').endOf('month').format(DATE_FORMAT);

                return API.get(`${Config.apiUrl}/publishers/budget-summary?token=${token}&start=${start}&end=${end}`);
            },

            success: PublisherActions.gotBudgetSummary,
            error: PublisherActions.getBudgetSummaryError
        }
    },
};

export default PublisherSource;
