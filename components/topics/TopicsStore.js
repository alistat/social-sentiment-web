"use strict";
import Vue from 'vue';
import enviroment from '~/config/environment';
import VuexRester from '../../vuex-rester';
import { ONLY_RESPONSE, arrayToMapById } from '../../vuex-rester';
import DummyResponses from './DummyTopicsResponces';

const rester = new VuexRester({
  dummy :enviroment.dummyBackend,
  baseUrl: enviroment.backendURL+'topics',
  dummyResponses: DummyResponses,
  socketUrl: enviroment.backendURL
});

export default {
  namespaced: true,
  state: {
    topics: {}
  },
  mutations: {
    setTopics(state, topics) {
      state.topics = arrayToMapById(topics)
    },
    addTopic(state, topic) {
      Vue.set(state.topics, topic._id, topic);
    },
    editTopic(state,newTopic) {
      const oldTopic = state.topics[newTopic._id];
      if (newTopic.name !== undefined) {
        oldTopic.name = newTopic.name;
      }
      
      if (newTopic.query !== undefined) {
        oldTopic.query = newTopic.query;
      }
    },
    deleteTopic(state,uid){
      Vue.delete(state.topics,uid);
    }
  },

  actions: {
    init(ctx) {
      rester.on('mutation-topics', msg => {
        ctx.commit(msg.mut, msg.data);
      });
      rester.emit(ctx, 'watch-topics-list', null, 'setTopics', null, ONLY_RESPONSE);
    },
    loadTopics(ctx) {
      rester.apiGet(ctx, "/topics", "setTopics");
    },
    addTopic(ctx, topic) {
      rester.apiPost(ctx, '/topic', topic,
        'addTopic', null, ONLY_RESPONSE)
    },
    editTopic(ctx, topic) {
      rester.apiPatch(ctx, '/topic/'+topic._id,topic,
        'editTopic',topic,ONLY_RESPONSE)
    },
    deleteTopic(ctx, uid) {
      rester.apiDelete(ctx, '/topic/'+uid,
        'deleteTopic', uid)
}
  }
}
