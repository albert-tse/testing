export function refreshMDL() {
    console.log('I am going to try to reinit');
    var layoutComponent = document.querySelector('.mdl-layout[data-upgraded]');
    if (layoutComponent !== null) { 
        layoutComponent.classList.remove('is-upgraded', 'has-drawer');
        layoutComponent.removeAttribute('data-upgraded');
    }

    typeof componentHandler !== 'undefined' && componentHandler.upgradeDom();

    // We also want to remove the extra mdl-layout__container it added, not sure why it was doing this
    var layoutContainer = document.querySelector('#app-container > .mdl-layout__container');

    if (layoutContainer) {
        var tabContent = document.querySelector('.tab-content');
        layoutContainer.appendChild(tabContent);

        var childContainer = layoutContainer.querySelector('.mdl-layout__container');
        childContainer && layoutContainer.removeChild(childContainer);
    }
}
