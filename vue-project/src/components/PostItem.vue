<template>
  <article class="post">
    <div class="date">
      {{ post.date }}
    </div>

    <div class="post-content">
      <div class="author">@{{ post.author }}</div>
      <p class="text">{{ post.text }}</p>

      <img
        v-if="post.image"
        :src="post.image"
        alt="Post image"
        class="post-image"
      />
    </div>

    <button class="like-button" @click="handleLike">
      <span class="like-button__icon">👍</span>
      <span class="like-button__count">{{ post.likes }}</span>
    </button>
  </article>
</template>

<script>
export default {
  name: 'PostItem',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleLike() {
      this.$store.commit('likePost', this.post.id);
    },
  },
};
</script>
