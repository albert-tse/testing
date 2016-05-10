import React from 'react';
import { Container, Drawer, AppBar, Main } from '../shared';

class App extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props);
    }

    render() {
        return (
            <Container>
                {this.props.appBar}
                <Drawer />
                <Main>
                    {this.props.main}
                </Main>
            </Container>
        );
    }
}

export default App;
