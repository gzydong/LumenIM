import store from '@/store';

export function findTalkIndex(index_name) {
    return store.state.talks.items.findIndex(
        (item) => item.index_name == index_name
    );
}

export function findTalk(index_name) {
    return store.state.talks.items.find(
        (item) => item.index_name == index_name
    );
}