import React from 'react'
import { AppBar, Checkbox, IconButton } from 'react-toolbox';
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import classNames from 'classnames'
import Styles from './style'

class FiltersSidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pinned: true
        }
    }

    render() {
        return (
            <Layout>
	            <Panel>
	                { this.props.children }
	            </Panel>
	            <Sidebar className={Styles.sidebar} pinned={ this.state.pinned } width={ 5 }>
	            	thigns and stuff
	            </Sidebar>
	        </Layout>
        );
    }
}

export default FiltersSidebar;
