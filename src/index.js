const logStuffOnLoad = () => {
    const el = document.createElement('div');
    el.innerHTML = '<h1>🍩</h1>';
    el.style.fontSize = '24px';
    document.body.appendChild(el);
};

logStuffOnLoad();

module.hot.accept(() => {
    logStuffOnLoad();
});
