import React from 'react';

class Image extends React.Component {

    constructor(props) {
        var image = new Image();
        image.src = this.props.src;
        console.log(image);
    }

    componentDidMount() {
    }

    render() {
        return (
            <img src="images/logo.svg" />
        );
    }

}

export default Image;
