import i18next from "i18next";
import resources from './locales/index.js';
import * as yup from 'yup';
import uniqueId from "lodash.uniqueid";
import watch from './view.js';

export default function app() {
    const elements = {
        form: document.querySelector('form.rss-form'),
        input: document.querySelector('#url-input'),
        button: document.querySelector('#add-url-button'),
        posts: document.querySelector('div.posts'),
        feeds: document.querySelector('div.feeds'),
    };

    const state = {
        rssInput: {
            status: 'filling',
            error: null,  
        },
        feeds: [],
        posts: [],
    };

    const i18nextInstance = i18next.createInstance();

    const i18nextPromise = i18nextInstance.init({
        lng: 'ru', 
        debug: true,
        resources,
    })
    .then(() => {
        yup.setLocale({
            mixed: {
                required: 'empty', // {key: empty}
                notOneOf: 'exists',
            },
            string: {
                url:'invalidUrl',
            },
        });

        function validateField(str, feeds) {
            const feedsUrls = feeds.map((feed) => feed.url);

            const schema = yup.string().url().required().notOneOf(feedsUrls);
            return schema.validate(str)
            .then(() => {
                return null;
            }).catch((error) => {
                return error.message; 
            })
        }

        const watchedState = watch(elements, i18nextInstance, state);

        elements.form.addEventListener('submit', (event) => {
            event.preventDefault();
            const value = elements.input.value;

            validateField(value, watchedState.feeds).then((message) => {
                if (!message) {
                    watchedState.feeds.push({
                        id: uniqueId('feed_'),
                        url: value,
                    });
                }
                watchedState.rssInput.error = message;
                watchedState.rssInput.status = 'sent'
            })
        });

        elements.input.addEventListener('input', () => {
            watchedState.rssInput.status = 'filling';
        });
    });

    return i18nextPromise;
}
