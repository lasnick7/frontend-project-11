import i18next from "i18next";
import resources from './locales/index.js';
import * as yup from 'yup';
import uniqueId from "lodash.uniqueid";
import watch from './view/view.js';
import parser from './parsers.js'

function getErrorType(error) {
    if (error === 'invalidRss') {
        return error;
    } else if (error === 'Failed to fetch') {
        return 'network';
    }
    return 'undefined';
}

function generateRandomParam() {
    const randomParam = Math.random().toString(36).substring(7);
    return randomParam;
}

function loadRss(watchedState, url) {
    watchedState.loadingProcess.status = 'loading';
    return fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&v=${generateRandomParam()}`)
        .then((response) => response.json())
        .then((responseJson) => {
            // console.log('response json', responseJson)

            const parsedXML = parser(responseJson.contents);
            // console.log('parsed data', parsedXML)

            watchedState.loadingProcess.error = null;

            watchedState.loadingProcess.status = 'success';

            const feedId = uniqueId('feed_');
            const feed = {
                feedId: feedId,
                url: responseJson.status.url,
                title: parsedXML.feedTitle,
                description: parsedXML.feedDescription,
            };
            watchedState.feeds.unshift(feed);

            const posts = parsedXML.posts.map((post) => {
                return {
                    feedId: feedId,
                    postId: uniqueId('post_'),
                    title: post.postTitle,
                    description: post.postDescription,
                    link: post.postLink,
                }
            });
            watchedState.posts.unshift(...posts);
        }).catch((error) => {
            console.log('rss loading error', error.message);
            watchedState.loadingProcess.error = getErrorType(error.message);

            watchedState.loadingProcess.status = 'failed';
        })      
}

function loadNewPosts(watchedState) {
    // console.log('watched state feeds', watchedState.feeds);
    const fetchNewPostsPromices = watchedState.feeds.map((feed) => {
        return fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(feed.url)}&v=${generateRandomParam()}`)
            .then((response) => response.json())
            .then((responseJson) => {
                const parsedXML = parser(responseJson.contents);

                const currentFeedId = feed.feedId;
                const oldPosts = watchedState.posts.filter((post) => post.feedId === currentFeedId);

                // const allTitles = parsedXML.posts.map((post) => post.postTitle);
                const oldTitles = oldPosts.map((post) => post.title);

                const newPosts = parsedXML.posts
                    .filter((post) => !oldTitles.includes(post.postTitle))
                    .map((post) => {
                        return {
                            feedId: currentFeedId,
                            postId: uniqueId('post_'),
                            title: post.postTitle,
                            description: post.postDescription,
                            link: post.postLink,
                        } 
                    });
                watchedState.posts.unshift(...newPosts);

                console.log('all posts for current feed', parsedXML.posts)
                console.log('old titles for current feed', oldTitles)
                console.log('new posts for current feed', newPosts)
            }).catch(error => console.log(error))
    });
    Promise.all(fetchNewPostsPromices).finally(() => {
        console.log('promises are promised')
        setTimeout(() => loadNewPosts(watchedState), 5000)
    })
}

export default function app() {
    const elements = {
        form: document.querySelector('form.rss-form'),
        input: document.querySelector('#url-input'),
        button: document.querySelector('#add-url-button'),
        feedback: document.querySelector('.feedback'),
        posts: document.querySelector('div.posts'),
        feeds: document.querySelector('div.feeds'),
    };

    const state = {
        rssInput: {
            status: 'filling',
            isValid: '?',
            error: null,  
        },
        loadingProcess: {
            status: '',
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
                watchedState.rssInput.error = message;
                if (!message) {
                    watchedState.rssInput.isValid = true;
                    loadRss(watchedState, value).then(() => {
                        watchedState.rssInput.status = 'sent'
                    });
                } else {
                    watchedState.rssInput.isValid = false;
                    watchedState.rssInput.status = 'sent'
                }
            })
        });

        elements.input.addEventListener('input', () => {
            watchedState.rssInput.status = 'filling';
            watchedState.rssInput.isValid = '?';
        });

        console.log('set timeouts init')

        loadNewPosts(watchedState)
    });

    return i18nextPromise;
}
