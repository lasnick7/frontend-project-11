export default function(data) {
    const domParser = new DOMParser();
    const xmlDocument = domParser.parseFromString(data, 'text/xml');
    // console.log('XML Document', xmlDocument);
    
    const parsererror = xmlDocument.querySelector('parsererror');
    if (parsererror) {
        throw new Error('invalidRss');
    }

    const feedTitle = xmlDocument.querySelector('title');
    const feedDescription = xmlDocument.querySelector('description');
    const items = xmlDocument.querySelectorAll('item');

    const posts = Array.from(items).map((item) => {
        const postTitle = item.querySelector('title');
        const postDescription = item.querySelector('description');
        const postLink = item.querySelector('link');

        return {
            postTitle: postTitle.textContent,
            postDescription: postDescription.textContent,
            postLink: postLink.textContent,
        }
    })
    
    return {
        feedTitle: feedTitle.textContent,
        feedDescription: feedDescription.textContent,
        posts,
    }
}