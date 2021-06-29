const Note = {
  state: {
    tags: [],
    class: [],
  },
  getters: {},
  mutations: {
    SET_NOTE_TAGS(state, tags) {
      state.tags = tags
    },

    PUSH_NOTE_TAG(state, tag) {
      state.tags.unshift(tag)
    },
  },
}

export default Note
