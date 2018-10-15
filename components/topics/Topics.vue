<template lang="pug">
  .topicsWrap
    .topicsList {{topics}}
    .newTopic
      button(@click="onAddTopic") Add Topic
</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex';

  export default {
    name: "Topics",
    data() {
      return {
      }
    },
    computed: {
      ...mapState('topics', ['topics']),
    },
    methods: {
      ...mapActions('topics', ['init', 'addTopic']),
      onAddTopic() {
        this.addTopic({name: "top"+Object.keys(this.topics).length, query: "#lala"})
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped lang="scss">

</style>
