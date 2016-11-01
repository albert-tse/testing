import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import ListPreview from './ListPreview';
import Styles from './style';

import Config from '../../config';

import _ from 'lodash';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            showAnim: false
        }
    }

    render() {
        return (
            <div className={Styles.viewPort}>
                <div 
                    className={
                        `${Styles.listViewPort} 
                         ${Styles["offset_" + this.state.offset]} 
                         ${this.state.showAnim ? this.state.animRight ? 
                            Styles["slide_right_" + this.state.offset] :
                            Styles["slide_left_" + this.state.offset] :
                            ''
                         }`
                    }
                >
                    <div className={Styles.listOfLists}>
                        {Config.listsOnHome.map(this.renderListPreview)}
                        {
                            _.map(Config.listsOnHome, function(list, index){
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }

    renderListPreview(list, index) {
        return React.createElement(ListPreview, {
            key: index,
            overrides: list.overrides,
            listId: list.type === 'static' && list.id,
            specialList: list.type === 'special' && list.name,
            listObj: list.type === 'object' && list.object
        });
    }

    mobileSwipeRight(){
        if(this.state.offset < Config.listsOnHome && this.state.offset < 15){
            this.setState({
                offset: this.state.offset+1,
                animRight: true,
                showAnim: true
            });
        }
    }

    mobileSwipeLeft(){
        if(this.state.offset > 0){
            this.setState({
                offset: this.state.offset-1,
                animRight: false,
                showAnim: true
            });
        }
    }

}
