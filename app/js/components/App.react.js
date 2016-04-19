import React from 'react';
import { Branding, Navigation } from '../templates';
import Feed from '../components/Feed.react';
import Sidebar  from '../components/Sidebar.react';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * Render the app here
     * -------------------------------------------------- */
    render() {
        return (
            <div id='app'>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container-fluid">
                        <Branding />
                        <Navigation />
                    </div>
                </nav>
                <section id="main" className="container-fluid">
                    <Sidebar />
                    <Feed />
                </section>
            </div>
        );
    }

}

export default App;
