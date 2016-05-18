import React from 'react';
import ReactDOM from 'react-dom';
import { refreshMDL } from '../../utils';

class Toolbar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        refreshMDL();
    }

    render() {
        return (
            <header id="header" className={::this.getClassName()}>
                <div className="mdl-layout-icon"></div>
                <div className="mdl-layout__header-row">
                    {this.renderTitle()}
                    <div className="mdl-layout-spacer"></div>
                    { 	
                    	this.props.children ? 
                    		this.props.children.map(function(child, i){
                    			return child;
                    		})
                    		: false	//Aka only render children if there are children
                    }
                </div>
            </header>
        );
    }

    getClassName() {
        return [
            'mdl-layout__header',
            'className' in this.props && this.props.className
        ].filter(Boolean).join(' ');
    }

    renderTitle() {
        if (typeof this.props.title === 'string') {
            return <span className="mdl-layout-title">{this.props.title}</span>
        } else {
            return this.props.title; // React element
        }
    }
}

export default Toolbar;
