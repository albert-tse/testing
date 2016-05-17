import React from 'react';
import AltContainer from 'alt-container';
import AppBar from './AppBar.component';
import Store from '../../stores/Explore.AppBar.store';

class ExploreAppBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer 
                store={Store} 
                component={AppBar} />
        );
    }
}

export default ExploreAppBar;
