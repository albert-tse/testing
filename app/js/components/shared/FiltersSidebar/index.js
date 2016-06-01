import React from 'react'
import Component from './FiltersSidebar.component'
import AltContainer from 'alt-container'
import UserStore from '../../../stores/User.store'

class FiltersSidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pinned: true
        }
    }

    render() {
        return <AltContainer
        stores = {
            {
                sites: (props) => {
                    return {
                        store: UserStore,
                        value: UserStore.getArticle(this.props.article.ucid)
                    };
                }
            }
        }
        component = { Component }
        inject = {
            {
                buttons: [{
                    type: Buttons.MORE
                }, {
                    type: Buttons.SHARE,
                    action: ArticleActions.share
                }],
                saveButton: {
                    show: true,
                    isSaved: isArticleSaved,
                    onSave: function(ucid) {
                        ListActions.addToSavedList([ucid]);
                    },
                    onRemove: function(ucid) {
                        ListActions.removeFromSavedList([ucid]);
                    }
                }
            }
        }
        />;
    }
}

export default FiltersSidebar
