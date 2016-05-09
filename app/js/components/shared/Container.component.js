import React from 'react';

class Container extends React.Component {

    constructor (props) {
        super(props);
    }

    render() {
        /* If necessary, we can extract the fixed-drawer and fixed-header classNames into props so we can modify header but I don't see us doing that at the moment */
        return (
            <div className="saved tab-content mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
                {this.props.children}
            </div>
        );
    }

}

export default Container;
