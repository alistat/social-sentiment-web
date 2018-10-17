<template lang="pug">
.card
  .topicWrap
    .newTopic
      h3.header New Topic
      fieldset
        label Name
        input(v-model='name', placeholder="Nd")
      fieldset
        label Query
        input(v-model='query', placeholder="query")
      .button
        button(@click="onAdd") Add Topic

</template>


<script>
import { mapGetters, mapState, mapActions } from 'vuex';

export default {
  name: 'NewTopic',
  props: [],
  data() {
    return {
      name: '',
      query: ''
    }
  },
  computed: {
    ...mapState('topics', ['topics'])

  },
  methods: {
    ...mapActions('topics', ['addTopic']),
    onAdd() {
      this.addTopic({
        name: this.name,
        query: this.query

      })
    }
  }

}


</script>

<style scoped lang="scss">

  .topicWrap{
    text-align: left;
    margin-left: 20px;

  }
  .header {
    margin: 2rem 0 0.8rem;
    color: #587d6e;
    font-weight: 300;
    font-size: 1.5rem;
  }
  fieldset {
    border: none;
    margin: 0;
    padding: 0.5rem 0;

  }
  label {
    min-width: 6rem;
    margin-right: 0.5rem;
    vertical-align: middle;
    display: inline-block;
  }

  .card {
      display: inline-block;
      box-shadow: 0 1px 2px 0 rgba(0,0,0,.15);
      margin: 10px;
      height: 200px;
      width: 500px;
      position: relative;
      margin-bottom: 10px;
      transition: all 0.2s ease-in-out;
      background-color: #c4cad1;
  }




</style>
