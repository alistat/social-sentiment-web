import Vuex from 'vuex';
import StatsStore from '../components/stats/StatsStore';
import TopicsStore from '../components/topics/TopicsStore';
import TrainingStore from '../components/training/TrainingStore';
import environment from '../config/environment';

const createStore = () => {
  return new Vuex.Store({
    state: {
      pageHead: 'Social Sentiment',
      environment,
    },
    mutations: {
      setPageHead(state, head) {
        state.pageHead = head;
      }
    },
    actions: {
    },
    modules: {
      stats: StatsStore,
      topics: TopicsStore,
      training: TrainingStore
    }
  })
};

export default createStore
