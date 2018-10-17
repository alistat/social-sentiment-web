<template lang="pug">
  .topicsWrap
      .h2.header Topics Management
      Topic(v-for="topic in topics", :topic="topic" ,:key="topic._id")
      NewTopic

</template>

<script>
  import { mapGetters, mapState, mapActions } from 'vuex';
  import NewTopic from './NewTopic'
  import Topic from './Topic'


  export default {
    name: "Topics",
    data() {
      return {
      }
    },
    computed: {
      ...mapState('topics', ['topics'])
    },
    methods: {
      ...mapActions('topics', ['init'])
      // onAddTopic() {
      //   this.addTopic({name: "top"+Object.keys(this.topics).length, query: "#lala"})

      },
    components: {
      Topic,
      NewTopic
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped lang="scss">
.header {
  margin: 2.5rem 0 0.8rem;
  color: #4682B4;
  font-weight: 300;
  font-size: 3.0rem;
}
.topicsWrap {
    text-align: center;
  }

.innerWrap {
    display: flex;
  }

</style>
