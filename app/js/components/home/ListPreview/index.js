import React, { Component } from 'react';
import AltContainer from 'alt-container'
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { Button } from 'react-toolbox/lib/button';
import Article from '../../shared/article/Article.container';
import Styles from './style';

import ListStore from '../../../stores/List.store';
import ListActions from '../../../actions/List.action';

import _ from 'lodash';

class ListPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        var list = this.props.list;

        if(this.props.overrides){
            list = _.extend({},this.props.list, this.props.overrides);
        }

        var articles = list.articles;

        return (
            <Card className={Styles.list}>
                <CardTitle
                  title={list.list_name}
                />
                <div className={Styles.articles}>
                    { 
                        _.chain(articles)
                            .map(function(article, index){
                                return (<Article key={index} article={{ucid: article.ucid}} showInfo={function(){}} />);
                            })
                            .value() 
                    }
                </div>

                <CardActions className={Styles.actions}>
                  <Button label="See More" />
                </CardActions>
            </Card>
        );
    }
}

export default class ListPreviewContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {      
        if(this.props.listId){
            ListActions.load([this.props.listId]);
        }else if(this.props.specialList){
            ListActions.loadSpecialList(this.props.specialList);
        }else if(this.props.listObj){
            injects.list = this.props.listObj;
        }
    }

    render() {
        var stores = {};
        var injects = {};

        if(this.props.listId){
            stores = {
                list: props => ({
                    store: ListStore,
                    value: ListStore.getList(this.props.listId)
                })
            }
        }else if(this.props.specialList){
            stores = {
                list: props => ({
                    store: ListStore,
                    value: ListStore.getSpecialList(this.props.specialList)
                })
            }
        }else if(this.props.listObj){
            injects.list = this.props.listObj;
        }else{
            //Nothing included, so do nothing
        }

        if(this.props.overrides){
            injects.overrides = this.props.overrides;
        }

        return (
            <AltContainer
                component={ ListPreview }
                actions={ ListActions }
                stores={ stores }
                inject={ injects }
            />
        );
    }

}
