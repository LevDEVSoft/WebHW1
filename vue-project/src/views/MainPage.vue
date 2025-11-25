<template>
  <div>
    <h1>Main page</h1>

    <button class="reset-btn" @click="resetLikes">
      Reset all likes
    </button>

    <main>
      <div class="sidebar-left">
        <p>Sidebar left content</p>
      </div>

      <section class="posts">
        <PostItem
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
      </section>

      <div class="sidebar-right">
        <p>Upcoming features will be displayed here</p>
      </div>
    </main>
  </div>
</template>

<script>
import PostItem from '../components/PostItem.vue';

export default {
  name: 'MainPage',
  components: { PostItem },
  computed: {
    posts() {
      return this.$store.state.posts;
    },
  },
  methods: {
    resetLikes() {
      this.$store.commit('resetLikes');
    },
  },
};
</script>
