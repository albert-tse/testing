import React from 'react';
import { Container, Header, Drawer, Main } from '../shared';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Header />
                <Drawer />
                <Main>
                    {this.props.children}
                </Main>
            </Container>
        );
    }
}

export default App;
