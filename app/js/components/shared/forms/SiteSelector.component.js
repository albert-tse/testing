import React from 'react';
import Select from 'react-select';
import AltContainer from 'alt-container';
import UserStore from '../../../stores/User.store';
import UserActions from '../../../actions/User.action';

class SiteSelector extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer component={Select}
                          store={UserStore}
                          actions={UserActions}
                          inject={{
                              multi: true,
                              value: props => props.store.getState().selectedSites,
                              options: props => props.store.getState().user.sites.map(site => ({
                                  value: site.id,
                                  label: site.name
                              })),
                              onChange: props => value => 
                                  props.actions.updateSelectedSites(value.map(selectedSite => selectedSite.value))
                          }} />
        );
    }
}

export default SiteSelector;
