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
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillMount() {
    }

    render() {
        return (
            <div className={Styles.viewPort}>
                <Button icon='remove' floating accent mini className={`${Styles.navButton} ${Styles.remove}`}/>
                <Button icon='add' floating accent mini className={`${Styles.navButton} ${Styles.add}`}/>
                <div className={Styles.listViewPort}> 
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
                    </div>
                </div>
            </div>
        );
        /*return (

        );*/
    }
}
