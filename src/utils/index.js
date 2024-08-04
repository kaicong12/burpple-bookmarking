import Fuse from 'fuse.js';

export const fuzzySearch = (events, query) => {
    const options = {
        keys: ['title', 'description', 'region', 'location'],
        includeScore: true,
        threshold: 0.5
    };

    const fuse = new Fuse(events, options);
    return fuse.search(query).map(result => result.item);
}