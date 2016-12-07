import React, { Component } from 'react';
import AltContainer from 'alt-container';
import _ from 'lodash';
import moment from 'moment';

import { Button } from 'react-toolbox/lib/button';
import Article from '../../shared/article/Article.container';
import Styles from './style';

import ListStore from '../../../stores/List.store';
import ListActions from '../../../actions/List.action';

import { extend, isEqual } from 'lodash';
import classnames from 'classnames';

export default class ListPreviewContainer extends Component {

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
        var injects = Object.assign({}, { previewArticle: this.props.previewArticle });

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

class ListPreview extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.previewArticle = this.props.previewArticle;
        this.renderArticle = this.renderArticle.bind(this);
    }

    render() {
        let list = this.props.list;

        list.articles = _.chain(list.articles).sortBy(function(el){
            return moment(el.added_to_list_date).toDate();
        }).reverse().value();

        if(this.props.overrides){
            list = extend({}, this.props.list, this.props.overrides);
        }

        return (
            <section className={Styles.list}>
                <Button icon={list.icon} label={list.list_name} primary className={`onboardStep ${list.list_name.toLowerCase().replace(' ', '-')}`} />
                <div className={Styles.articles}>
                    {Array.isArray(list.articles) && list.articles.slice(0,12).map(this.renderArticle)}
                </div>
            </section>
        );
    }

    renderArticle(article, index) {
        return (
            <Article key={index} article={{ucid: article.ucid}} className={Styles.article} showInfo={this.previewArticle} selectable={false} />
        );
    }
}
