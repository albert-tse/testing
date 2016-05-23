import React from 'react';
import Config from '../../config';

var html = 
        `<!-- Template tags are not supported in IE -->
            <!-- TODO: move these to separate components -->
            <script id="disable-switch-tpl" type="text/template">
                <span class="round switch">
                        <input id="disable-switch-for-<%= ucid %>" class="visibility toggle" data-id="<%= ucid %>" <%= isDisabled ? 'checked' : '' %> type="checkbox">
                        <label for="disable-switch-for-<%= ucid %>"></label>
                    </span>
            </script>
            <script id="partner-option-tpl" type="text/template">
                <option value="<%= id %>">
                    <%= name %>
                </option>
            </script>
            <script id="score-tpl" type="text/template">
                <span class="score">rated
                    <%= score %>
                </span>
            </script>
            <script id="source-option-tpl" type="text/template">
                <option value="<%= value %>">
                    <%= label %>
                </option>
            </script>
            <script id="mtd-link-filter-checkbox-tpl" type="text/template">
                <li>
                    <input id="<%= id %>" name="<%= name %>" value="<%= label %>" type="checkbox" checked />
                    <label for="<%= id %>">
                        <a title="<%= label %>">
                            <span class="badge"><%= count %></span>
                            <%= label %>
                        </a>
                    </label>
                </li>
            </script>
            <script id="copiable-link-tpl" type="text/template">
                <input id="<%= target %>" class="copiable" type="text" value="<%= url %>" readonly>
                <i class="copy-button fa fa-copy" data-clipboard-target="#<%= target %>"></i>
            </script>`;

var legacyHTMLBlob = {
    __html: html
};

class LegacyTemplates extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
        	<div dangerouslySetInnerHTML={legacyHTMLBlob} />
        );
    }
}

export default LegacyTemplates;
