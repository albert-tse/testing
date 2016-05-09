import React from 'react';

class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <main className="mdl-layout__content">
                <div className="page-content">
                    {this.props.children}
                </div>
            </main>
        );
    }
}

export default Main;
