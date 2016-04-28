import React from 'react';
import AltContainer from 'alt-container';
import InfoBarActions from '../../actions/InfoBar.action.js';
import InfoBarStore from '../../stores/InfoBar.store.js';
import InfoBar from './InfoBar.component';

class InfoBarContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer stores={ { store: InfoBarStore } } actions={InfoBarActions} component={InfoBar} />
        );
    }
}

export default InfoBarContainer;
