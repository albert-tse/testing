import React from 'react';
import { Container, Drawer, AppBar, Main } from '../shared';
import Notifications from './Notifications'

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    // XXX Turns out material design lite is mainly for static sites
    // This kludge should be removed when we replace MDL components 
    // with something more react-ful
    componentDidUpdate() {
        var layoutComponent = document.querySelector('.mdl-layout.is-upgraded');
        if (layoutComponent !== null && typeof componentHandler !== 'undefined') {
            layoutComponent.classList.remove('is-upgraded', 'has-drawer');
            layoutComponent.removeAttribute('data-upgraded');
            componentHandler.upgradeDom();

            // We also want to remove the extra mdl-layout__container it added, not sure why it was doing this
            var layoutContainer = document.querySelector('#app-container > .mdl-layout__container');
            var tabContent = document.querySelector('.tab-content');
            layoutContainer.appendChild(tabContent);
            layoutContainer.removeChild(layoutContainer.querySelector('.mdl-layout__container'));
        }
    }

    render() {
        return (
            <Container>
                {this.props.appBar}
                <Drawer />
                <Main>
                    {this.props.main}
                </Main>
                <Notifications />
            </Container>
        );
    }
}

export default App;
