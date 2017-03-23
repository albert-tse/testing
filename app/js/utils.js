export function isMobilePhone() {
    const dimensions = getViewportSize();
    return 'width' in dimensions && dimensions.width <= 720; // TODO move these to constants in a Config file
}

export function isMobileTablet() {
    const dimensions = getViewportSize();
    return 'width' in dimensions && dimensions.width <= 1280;
}

export function getViewportSize() {
    if (document && document.body) {
        return document.body.getBoundingClientRect();
    } else {
        return {};
    }
}

export function injectScript(src) {
    let script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
}

export function injectStylesheet(src) {
    let style = document.createElement('style');
    style.href = src;
    style.type = 'text/css';
    style.rel = 'stylesheet';
    document.head.appendChild(style);
}

// source: http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
export function gup( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}
