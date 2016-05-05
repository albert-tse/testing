import React from 'react'

/**
 * Article Component
 * @prop int key is going to be used by React to manage a collection of this component
 * @prop Object data describes one article
 * @return React.Component
 */
class Article extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props.data);
    }

    render() {
        if ('data' in this.props) {
            return (
                <div className="grid-item article">
                    an article
                </div>
            );
        }

        return (
            <div />
        );
    }
    
}

export default Article;
