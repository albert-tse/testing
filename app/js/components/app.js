import React from 'react';
import config from '../config';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    /**
     * Render the app here
     * -------------------------------------------------- */
    /*render() {
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
    }*/
    render() {
        return (
            <div id='app'>
                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container-fluid">
                        Hello Worlds {config.api_url}
                    </div>
                </nav>
            </div>
        );
    }
}

export default App;
