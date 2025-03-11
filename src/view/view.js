import onChange from "on-change";
import { loadingProcessValidationHandler, rssInputValidationHandler } from './handlers.js';
import { renderFeeds, renderPosts, renderWatchedPost, renderModalWindow } from "./renders.js";

export default function(elements, i18next, state) {
    function render(path, value, previousValue) {
        switch (path) {
            case 'feeds':
                console.log('feed added: ', value);
                renderFeeds(elements, i18next, value);
                break
            case 'posts':
                console.log('posts added: ', value);
                renderPosts(elements, i18next, value, previousValue, watchedState);
                break
            case 'rssInput.error':
                console.log('errors added: ', value)
                break
            case 'loadingProcess.error':
                console.log('loading process error added: ', value);
                break
            case 'rssInput.status':
                console.log('status changed: ', value)
                switch (value) {
                    case 'sent':
                        if (state.rssInput.isValid && state.loadingProcess.status === 'success') {
                            elements.input.value = '';
                            elements.input.focus();
                        }
                        break
                    case 'filling':
                        break
                }
                break
            case 'rssInput.isValid':
                rssInputValidationHandler(elements, i18next, state, value);
                break
            case 'loadingProcess.status':
                console.log('url valid, loading process changed: ', value);
                loadingProcessValidationHandler(elements, i18next, state, value);
                break
            case 'UI.watchedPosts':
                renderWatchedPost(value);
                break
            case 'UI.modal':
                renderModalWindow(elements, value)
                break
        }
    }

    const watchedState = onChange(state, render);

    return watchedState;
}