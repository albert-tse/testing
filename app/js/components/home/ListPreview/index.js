import React, { Component } from 'react';
import AltContainer from 'alt-container'
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { Button } from 'react-toolbox/lib/button';
import Article from '../../shared/article/Article.container';
import Styles from './style';

import ListStore from '../../../stores/List.store';
import ListActions from '../../../actions/List.action';

import _ from 'lodash';
import classnames from 'classnames';

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

        return (
            <section className={Styles.list}>
                <header className={Styles.sectionHeader}>
                    <h2 className={Styles.sectionTitle}>{list.list_name}</h2>
                    <Button label="more" />
                </header>
                <div className={Styles.articles}>
                    {Array.isArray(list.articles) && list.articles.map((article, index) => 
                        <Article key={index} article={{ucid: article.ucid}} showInfo={function(){}} />
                    )}
                </div>
            </section>
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
