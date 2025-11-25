import { createStore } from 'vuex';
import posts from '../posts.json';

export default createStore({
  state() {
    return {
      posts: posts.map(p => ({ ...p, likes: 0 })),
    };
  },
  mutations: {
    likePost(state, id) {
      const post = state.posts.find(p => p.id === id);
      if (post) post.likes++;
    },
    resetLikes(state) {
      state.posts.forEach(p => (p.likes = 0));
    },
  },
});

