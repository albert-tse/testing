import React, { Component } from 'react';
import { Button } from 'react-toolbox/lib/button';
import ListPreview from './ListPreview';
import Styles from './style';
import _ from 'lodash';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            lists: [{
                type: 'special',
                name: 'curated-external',
                overrides: {
                    list_name: "Curated Posts"
                }
            },{
                type: 'special',
                name: 'recommended',
                overrides: {
                    list_name: "Recommended Posts"
                }
            },{
                type: 'special',
                name: 'saved',
                overrides: {
                    list_name: "Recently Saved Posts"
                }
            }],
            showAnim: false
        }
    }

    componentWillMount() {
    }

    mobileSwipeRight(){
        if(this.state.offset < this.state.lists.length-1 && this.state.offset < 15){
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

    render() {
        return (
            <div className={Styles.viewPort}>
                <Button icon='remove' floating accent mini className={`${Styles.navButton} ${Styles.remove}`} onClick={this.mobileSwipeLeft.bind(this)} />
                <Button icon='add' floating accent mini className={`${Styles.navButton} ${Styles.add}`} onClick={this.mobileSwipeRight.bind(this)} />
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
                        {
                            _.map(this.state.lists, function(list, index){
                                if(list.type == "static"){
                                    return <ListPreview 
                                        listId={list.id}
                                        overrides={list.overrides} 
                                        key={index}
                                    />;
                                } else if (list.type == "special"){
                                    return <ListPreview 
                                        specialList={list.name} 
                                        overrides={list.overrides} 
                                        key={index}
                                    />;
                                } else if (list.type == "object"){
                                    return <ListPreview 
                                        listObj={list.object} 
                                        overrides={list.overrides} 
                                        key={index}
                                    />;
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}