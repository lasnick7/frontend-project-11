function setAttibutestoPostElement(element, id, link) {
    const a = element.querySelector('a');
    const button = element.querySelector('button');

    element.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    a.setAttribute('href', link);
    a.classList.add('fw-bold');
    a.dataset.id = id;
    a.setAttribute('target', '_blank');
    a.setAttribute('re', 'noopener');
    a.setAttribute('rel', 'noreferrer');

    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = id;
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
}

function renderFeeds(elements, i18next, feeds) {
    const newFeed = feeds[0];

    let feedsCard = elements.feeds.querySelector('.card');
    if (!feedsCard) {
        console.log('feed container does not exists');

        feedsCard = document.createElement('div');
        feedsCard.classList.add('card', 'border-0');
        elements.feeds.append(feedsCard);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h2');
        cardTitle.textContent = i18next.t('titles.feeds');
        cardTitle.classList.add('card-title', 'h4');
        cardBody.append(cardTitle);

        const feedList = document.createElement('ul');
        feedList.classList.add('list-group', 'border-0', 'rounded-0');

        feedsCard.append(cardBody);
        feedsCard.append(feedList);

        console.log('feed card container after creation');
    }
    const feedsList = feedsCard.querySelector('ul.list-group');

    const feedItem = document.createElement('li');
    feedItem.classList.add('list-group-item', 'border-0','border-end-0');

    const feedTitle = document.createElement('h3');
    feedTitle.textContent = newFeed.title;
    feedTitle.classList.add('h6', 'm-0');

    const feedDescription = document.createElement('p');
    feedDescription.textContent = newFeed.description;
    feedDescription.classList.add('m-0', 'small', 'text-black-50');

    feedItem.append(feedTitle);
    feedItem.append(feedDescription);
    
    feedsList.prepend(feedItem)

    console.log('feed card container exists');
    console.log(newFeed)
    console.log(feedsList);
}

function renderPosts(elements, i18next, posts, previousPosts) {
    const newPostsCount = posts.length - previousPosts.length;
    const newPosts = posts.slice(0, newPostsCount);

    let postsCard = elements.posts.querySelector('.card');
    if (!postsCard) {
        console.log('post container does not exists');

        postsCard = document.createElement('div');
        postsCard.classList.add('card', 'border-0');
        elements.posts.append(postsCard);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h2');
        cardTitle.textContent = i18next.t('titles.posts');
        cardTitle.classList.add('card-title', 'h4');
        cardBody.append(cardTitle);

        const postList = document.createElement('ul');
        postList.classList.add('list-group', 'border-0', 'rounded-0');

        postsCard.append(cardBody);
        postsCard.append(postList);

        console.log('post card container after creation');
    }
    const postsList = postsCard.querySelector('ul.list-group');

    const postsArr = [];
    newPosts.forEach((post) => {
        const postItem = document.createElement('li');

        const postTitleLink = document.createElement('a');
        postTitleLink.textContent = post.title;

        const postDescription = document.createElement('button');
        postDescription.textContent = i18next.t('buttons.watch')

        postItem.append(postTitleLink);
        postItem.append(postDescription);

        setAttibutestoPostElement(postItem, post.postId, post.link);
    
        postsArr.push(postItem);
    })
    postsList.prepend(...postsArr)
}

export { renderFeeds, renderPosts };