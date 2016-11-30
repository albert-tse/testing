export function isMobilePhone() {
    const dimensions = getViewportSize();
    return 'width' in dimensions && dimensions.width <= 720; // TODO move these to constants in a Config file
}

export function getViewportSize() {
    if (document && document.body) {
        return document.body.getBoundingClientRect();
    } else {
        return {};
    }
}
