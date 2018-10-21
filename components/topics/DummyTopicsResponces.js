"use strict";
import {newDummyId} from '../../vuex-rester';

const initial = [
  {_id: 0, name: 'ΣΥΡΙΖΑ', query: "#syriza OR #Syrizanel OR #ΣΥΡΙΖΑ -#ND -#ΝewDemocracy -#ΝΔ"},
  {_id: 1, name: 'Νέα Δημοκρατία', query: "#ND OR #ΝewDemocracy OR #ΝΔ -#syriza -#Syrizanel -#ΣΥΡΙΖΑ"}];

export default {
  'GET /topics': initial,
  'GET /topic/0': initial[0],
  'GET /topic/1': initial[1],

  'POST /topic': function ({state}, urlParams, apiParam, broadcast) {
    let resp = {  _id: newDummyId(initial.length),
      name: apiParam.name, query:  apiParam.query};
    broadcast('topics-list', 'mutation-topics', {mut: 'addTopic', data: resp});
    return resp;
  },
  'PATCH /topic/:tid': function ({state}, urlParams, apiParam, broadcast) {
    let resp = Object.assign({}, state.topics[+urlParams.tid], apiParam);
    broadcast('topics-list', 'mutation-topics', {mut: 'editTopic', data: resp});
    return resp;
  },
  'DELETE /topic/:tid': function ({state}, urlParams, apiParam, broadcast) {
    broadcast('topics-list', 'mutation-topics', {mut: 'deleteTopic', data: +urlParams.tid});
    return {};
  },
  'SOCKET watch-topics-list': function ({state}, urlParams, apiParam, socketServer) {
    console.log(socketServer);
    socketServer.joinRoom('topics-list');
    return initial;
  },
}
