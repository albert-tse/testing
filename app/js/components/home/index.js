import React, { Component } from 'react';
import AltContainer from 'alt-container';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { Button } from 'react-toolbox/lib/button';
import Article from '../shared/article/Article.container';
import Styles from './style';
import _ from 'lodash';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            numLists: 6,
            showAnim: false
        }
    }

    componentWillMount() {
    }

    mobileSwipeRight(){
        console.log(this.state);
        if(this.state.offset < this.state.numLists && this.state.offset < 12){
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
                        <Card className={Styles.list}>
                            <CardTitle
                              avatar="https://placeimg.com/80/80/animals"
                              title="This should be the list name"
                            />
                            <div className={Styles.articles}>
                                <Article article={{ucid: 772103}} showInfo={function(){}} />
                                <Article article={{ucid: 772103}} showInfo={function(){}} />
                                <Article article={{ucid: 772103}} showInfo={function(){}} />
                                <Article article={{ucid: 772103}} showInfo={function(){}} />
                                <Article article={{ucid: 772103}} showInfo={function(){}} />
                                <Article article={{ucid: 772103}} showInfo={function(){}} />
                            </div>

                            <CardActions className={Styles.actions}>
                              <Button label="Settings Menu?" />
                              <Button label="See More" />
                            </CardActions>
                        </Card>
                        <Card className={Styles.list}>
                            <CardTitle
                              avatar="https://placeimg.com/80/80/animals"
                              title="This should be the list name"
                            />

                            <div className={Styles.articles}>
                                <Article article={{ucid: 772104}} showInfo={function(){}} />
                                <Article article={{ucid: 772104}} showInfo={function(){}} />
                                <Article article={{ucid: 772104}} showInfo={function(){}} />
                                <Article article={{ucid: 772104}} showInfo={function(){}} />
                                <Article article={{ucid: 772104}} showInfo={function(){}} />
                                <Article article={{ucid: 772104}} showInfo={function(){}} />
                            </div>

                            <CardActions className={Styles.actions}>
                              <Button label="Settings Menu?" />
                              <Button label="See More" />
                            </CardActions>
                        </Card>
                        <Card className={Styles.list}>
                            <CardTitle
                              avatar="https://placeimg.com/80/80/animals"
                              title="This should be the list name"
                            />

                            <div className={Styles.articles}>
                                <Article article={{ucid: 772105}} showInfo={function(){}} />
                                <Article article={{ucid: 772105}} showInfo={function(){}} />
                                <Article article={{ucid: 772105}} showInfo={function(){}} />
                                <Article article={{ucid: 772105}} showInfo={function(){}} />
                                <Article article={{ucid: 772105}} showInfo={function(){}} />
                                <Article article={{ucid: 772105}} showInfo={function(){}} />
                            </div>

                            <CardActions className={Styles.actions}>
                              <Button label="Settings Menu?" />
                              <Button label="See More" />
                            </CardActions>
                        </Card>
                        <Card className={Styles.list}>
                            <CardTitle
                              avatar="https://placeimg.com/80/80/animals"
                              title="This should be the list name"
                            />

                            <div className={Styles.articles}>
                                <Article article={{ucid: 772106}} showInfo={function(){}} />
                                <Article article={{ucid: 772106}} showInfo={function(){}} />
                                <Article article={{ucid: 772106}} showInfo={function(){}} />
                                <Article article={{ucid: 772106}} showInfo={function(){}} />
                                <Article article={{ucid: 772106}} showInfo={function(){}} />
                                <Article article={{ucid: 772106}} showInfo={function(){}} />
                            </div>

                            <CardActions className={Styles.actions}>
                              <Button label="Settings Menu?" />
                              <Button label="See More" />
                            </CardActions>
                        </Card>
                        <Card className={Styles.list}>
                            <CardTitle
                              avatar="https://placeimg.com/80/80/animals"
                              title="This should be the list name"
                            />

                            <div className={Styles.articles}>
                                <Article article={{ucid: 772107}} showInfo={function(){}} />
                                <Article article={{ucid: 772107}} showInfo={function(){}} />
                                <Article article={{ucid: 772107}} showInfo={function(){}} />
                                <Article article={{ucid: 772107}} showInfo={function(){}} />
                                <Article article={{ucid: 772107}} showInfo={function(){}} />
                                <Article article={{ucid: 772107}} showInfo={function(){}} />
                            </div>

                            <CardActions className={Styles.actions}>
                              <Button label="Settings Menu?" />
                              <Button label="See More" />
                            </CardActions>
                        </Card>
                        <Card className={Styles.list}>
                            <CardTitle
                              avatar="https://placeimg.com/80/80/animals"
                              title="This should be the list name"
                            />

                            <div className={Styles.articles}>
                                <Article article={{ucid: 772108}} showInfo={function(){}} />
                                <Article article={{ucid: 772108}} showInfo={function(){}} />
                                <Article article={{ucid: 772108}} showInfo={function(){}} />
                                <Article article={{ucid: 772108}} showInfo={function(){}} />
                                <Article article={{ucid: 772108}} showInfo={function(){}} />
                                <Article article={{ucid: 772108}} showInfo={function(){}} />
                            </div>

                            <CardActions className={Styles.actions}>
                              <Button label="Settings Menu?" />
                              <Button label="See More" />
                            </CardActions>
                        </Card>
                        <Card className={Styles.list}>
                            <CardTitle
                              avatar="https://placeimg.com/80/80/animals"
                              title="This should be the list name"
                            />

                            <div className={Styles.articles}>
                                <Article article={{ucid: 772109}} showInfo={function(){}} />
                                <Article article={{ucid: 772109}} showInfo={function(){}} />
                                <Article article={{ucid: 772109}} showInfo={function(){}} />
                                <Article article={{ucid: 772109}} showInfo={function(){}} />
                                <Article article={{ucid: 772109}} showInfo={function(){}} />
                                <Article article={{ucid: 772109}} showInfo={function(){}} />
                            </div>

                            <CardActions className={Styles.actions}>
                              <Button label="Settings Menu?" />
                              <Button label="See More" />
                            </CardActions>
                        </Card>
                    </div>
                </div>
            </div>
        );
        /*return (

        );*/
    }
}
