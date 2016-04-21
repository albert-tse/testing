import React from 'react';
import Config from '../../config'
import { Header } from '../shared'

class Legacy extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='app'>
                <Header />
                        This is the legacy App
            </div>
        );
    }
}

export default Legacy;
