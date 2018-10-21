<template lang="pug">
.card
  .topicWrap
    #contentShow(v-show="!isEditing")
          .cardText Name
          .var {{topic.name}}
          .cardText Query
          .var {{topic.query}}
            .buttonWrap
              button(@click="showForm") Edit
              button(@click="onRemove") Delete
    #contentEdit(v-show="isEditing")
        fieldset
          label Name
          input(v-model:name="topic.name")
        fieldset
          label Query
          input(v-model:query="topic.query" )
        .buttonWrap
          button(@click="onCancel") Close
          button(@click="onEditTopic") Save
</template>


<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: "Topic",
  props: ["topic"],
  data() {
    return {
      isEditing: false
    };
  },
  computed: {
    ...mapState('topics', ['topics'])
  },
  methods: {
    ...mapActions('topics', ['deleteTopic', 'editTopic']),
    onRemove() {
      this.deleteTopic(this.topic._id)

    },
    onEditTopic() {
      this.editTopic({
        _id: this.topic._id
      })

      this.hideForm();
    }
    ,
    showForm() {
      this.beforeTopic = Object.assign({},(this.topic));
      this.isEditing = true;
    },
    hideForm() {
      this.isEditing = false;
    },

    onCancel(){
      Object.assign(this.topic,this.beforeTopic);
      this.hideForm();

    }
  }

}
</script>


<style scoped lang="scss">
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
    font-weight: 600;

}

input {
  margin-top:5px;
}

#contentShow {
  margin-top: 15px;
}

#contentEdit {
  margin-top: 15px;
}

.var{
  margin-bottom: 5px;
}

.cardText{
  font-weight: 600;
  color:#e56b71;
}

.buttonWrap{
  margin-top: 45px;
  padding-right: 40px;

}
button{
  margin-right:20px!important;
}



.topicWrap {
  text-align: left;
  margin-left: 20px;
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
    background-color: #f3eff7;
}

.card:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    margin-bottom: 10px;

}

.container {
    padding: 2px 16px;
}
</style>
