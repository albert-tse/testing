import React from 'react'
import { AppBar, Checkbox, IconButton } from 'react-toolbox'
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox'
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list'
import Chip from 'react-toolbox/lib/chip'
import classNames from 'classnames'
import Styles from './style'

class FiltersSidebar extends React.Component {

    constructor(props) {
        super(props);
    }

    renderFilterOptions(option, key) {
        if (option.count && !option.leftIcon) {
            option.leftIcon = [<Chip key="1">{option.count}</Chip>];
        }

        var disabled = false;
        if (option.disabled) {
            disabled = true;
            delete option.disabled;
        }

        var clickHandler = function(event) {
            this.props.handler(event, option.section_id, option.id);
        }.bind(this);

        return (
            <ListItem key={ key } { ...option } selectable onClick={ clickHandler } className={ disabled ? Styles.disabled : Styles.active }/>
        );
    }

    renderFilterSection(section, key) {
        var props = _.assign({}, section);
        delete props.filters;

        section.filters = section.filters.map(function(el) {
            el.section_id = section.id;
            return el;
        });

        return (
            <span key={ key }>
                <ListSubHeader { ...props } />
                { section.filters.map(::this.renderFilterOptions) }
            </span>
        );
    }

    renderFilterList() {
        return (
            <List selectable ripple>
                { _.map(this.state.filters, ::this.renderFilterSection) }
            </List>
        );
    }

    renderCollapsedLabel() {
        return <div>&lt;</div>;
    }

    render() {
        this.state = {
            filters: _.cloneDeep(this.props.filters)
        }

        var collapsed = this.props.collapsed === undefined ? false : this.props.collapsed;

        var expandedProps = {
            width: 3,
            pinned: true,
            className: Styles.sidebar
        }

        var collapsedProps = {
            width: 1,
            pinned: true,
            className: Styles.sidebar
        }

        var props = collapsed ? collapsedProps : expandedProps;

        return (
            <Layout>
                <Panel>
                    { this.props.children }
                </Panel>
                <Sidebar { ...props }>
                    { collapsed ? ::this.renderCollapsedLabel() : ::this.renderFilterList() }
                </Sidebar>
            </Layout>
        );
    }
}

export default FiltersSidebar;
