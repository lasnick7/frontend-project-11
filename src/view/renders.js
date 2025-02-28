function renderFeeds(elements, i18next, feeds) {
    const newFeed = feeds[0];

    let feedCard = elements.feeds.querySelector('.card');
    if (!feedCard) {
        console.log('feed container does not exists');

        feedCard = document.createElement('div');
        feedCard.classList.add('card', 'border-0');
        elements.feeds.append(feedCard);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h2');
        cardTitle.textContent = i18next.t('titles.feeds');
        cardTitle.classList.add('card-title', 'h4');
        cardBody.append(cardTitle);

        const feedList = document.createElement('ul');
        feedList.classList.add('list-group', 'border-0', 'rounded-0');

        feedCard.append(cardBody);
        feedCard.append(feedList);

        console.log('feed card container after creation');
    }
    const feedList = feedCard.querySelector('ul.list-group');

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
    
    feedList.prepend(feedItem)

    console.log('feed card container exists');
    console.log(newFeed)
    console.log(feedList);
}

export { renderFeeds };