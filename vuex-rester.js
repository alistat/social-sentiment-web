import axios from 'axios';
import RouteParser from '@funjs/route-parser';

export const IDENTITY = x => x;
export const ONLY_MUT_PARAM = (x, y) => x;
export const ONLY_RESPONSE = (x, y) => y;

let LAST_DUMMY_ID = 0;
let multitabChannel = null;
if (typeof window !== "undefined" && window.BroadcastChannel) {
  multitabChannel = new BroadcastChannel("vuex-rester");
}

export function newDummyId(min = 0) {
  LAST_DUMMY_ID = Math.max(min, LAST_DUMMY_ID+1);
  if (multitabChannel) {
    multitabChannel.postMessage({type: "NEW_ID", id: LAST_DUMMY_ID});
  }
  return LAST_DUMMY_ID;
}

if (multitabChannel) {
  multitabChannel.onmessage = (ev) => {
    if (ev.data) {
      if (ev.data.type === "NEW_ID" && ev.data.id > LAST_DUMMY_ID) {
        LAST_DUMMY_ID = ev.data.id;
      }
    }
  }
}

export function arrayToMapById(arr, idField='_id') {
  const result = {};
  for (const el of arr) {
    if (el[idField] !== undefined) {
      result[el[idField]] = el;
    }
  }
  return result;
}

function parseDummyResponses(dr) {
  const result = {
    GET: [],
    POST: [],
    PUT: [],
    PATCH: [],
    DELETE: [],
    SOCKET: []
  };
  for (const route of Object.keys(dr)) {
    let split = /(GET|POST|PUT|PATCH|DELETE|SOCKET) (.*)/.exec(route);
    const routeParsed = RouteParser(split[2]);
    result[split[1]].push({
      route: routeParsed,
      response: dr[route]
    })
  }
  return result;
}

function routeRequest(verb, dummies, ctx, apiPath, apiParam, socketServer) {
  const routes = dummies[verb];
  for (const dummyResponse of routes) {
    const urlParams = dummyResponse.route.match(apiPath);
    if (urlParams) {
      let result = dummyResponse.response;
      if (typeof result === "function") {
        if (verb === "SOCKET") {
          return result(ctx, urlParams, apiParam, socketServer);
        } else {
          return result(ctx, urlParams, apiParam, socketServer ? socketServer.broadcast : null);
        }
      } else {
        return result;
      }
    }
  }
  return undefined;
}


export default class VuexRester {

  constructor({dummy=false, baseUrl='', dummyResponses={}, axiosDefaults={}, configExtractor=null,
                socketUrl = null, socketMessagePreprocessor = null}) {
    this.baseUrl = baseUrl;
    this.socketUrl = socketUrl;
    this.socketMessagePreprocessor = socketMessagePreprocessor;
    axiosDefaults.baseUrl = baseUrl;
    this.ax = axios.create(axiosDefaults);
    this.configExtractor = configExtractor;
    this.dummy = dummy;

    if (dummy) {
      this.dummyResponses = parseDummyResponses(dummyResponses);
    }
    if (socketUrl) {
      if (dummy) {
        this._dummySocketRooms = {};
        this._dummySocketMessageHandlers = {};
        if (multitabChannel) {
          this._dummySocketChannel = new BroadcastChannel(`vuex-rester-socket ${socketUrl}`);
          this._dummySocketChannel.onmessage = this._handleDummySocketChannelMessage.bind(this);
        }
        this._dummySocketServer = {
          joinRoom: this._joinDummySocketRoom.bind(this),
          leaveRoom: this._leaveDummySocketRoom.bind(this),
          broadcast: this._dummySocketBroadcast.bind(this)
        };
      } else if (typeof window.io !== "undefined") {
        this.socket = io(socketUrl);
      } else {
        console.error("Socket IO not found");
      }
    }
  }

  apiGet(ctx, apiPath, mutation, respMap=IDENTITY) {
    if (this.dummy) {
      const resp = routeRequest('GET', this.dummyResponses, ctx, apiPath, null, this._dummySocketServer);
      if (mutation) ctx.commit(mutation, respMap(resp));
      return Promise.resolve(resp);
    }
    const conf = this.configExtractor ? this.configExtractor(ctx) : {};
    return new Promise((resolve, reject) => {
      this.ax.get(this.baseUrl+apiPath, conf)
        .then(resp => {
          if (mutation) ctx.commit(mutation, respMap(resp.data));
          resolve(resp.data);
        }, reject)
    })
  }

  apiPost(ctx, apiPath, apiParam, mutation, mutParam, respCombine=ONLY_MUT_PARAM) {
    if (this.dummy) {
      const resp = routeRequest('POST', this.dummyResponses, ctx, apiPath,
        apiParam, this._dummySocketServer);
      if (mutation) ctx.commit(mutation, respCombine(mutParam, resp));
      return Promise.resolve(resp);
    }
    const conf = this.configExtractor ? this.configExtractor(ctx) : {};
    return new Promise((resolve, reject) => {
      this.ax.post(this.baseUrl+apiPath, apiParam, conf)
        .then(resp => {
          if (mutation) ctx.commit(mutation, respCombine(mutParam, resp.data));
          resolve(resp.data);
        }, reject)
    })
  }

  apiPatch(ctx, apiPath, apiParam, mutation, mutParam, respCombine=ONLY_MUT_PARAM) {
    if (this.dummy) {
      const resp = routeRequest('PATCH', this.dummyResponses, ctx, apiPath,
        apiParam, this._dummySocketServer);
      if (mutation) ctx.commit(mutation, respCombine(mutParam, resp));
      return Promise.resolve(resp);
    }
    const conf = this.configExtractor ? this.configExtractor(ctx) : {};
    return new Promise((resolve, reject) => {
      this.ax.patch(this.baseUrl+apiPath, apiParam, conf)
        .then(resp => {
          if (mutation) ctx.commit(mutation, respCombine(mutParam, resp.data));
          resolve(resp.data);
        }, reject)
    })
  }

  apiPut(ctx, apiPath, apiParam, mutation, mutParam, respCombine=ONLY_MUT_PARAM) {
    if (this.dummy) {
      const resp = routeRequest('PUT', this.dummyResponses, ctx, apiPath,
        apiParam, this._dummySocketServer);
      if (mutation) ctx.commit(mutation, respCombine(mutParam, resp));
      return Promise.resolve(resp);
    }
    const conf = this.configExtractor ? this.configExtractor(ctx) : {};
    return new Promise((resolve, reject) => {
      this.ax.put(this.baseUrl+apiPath, apiParam, conf)
        .then(resp => {
          if (mutation) ctx.commit(mutation, respCombine(mutParam, resp.data));
          resolve(resp.data);
        }, reject)
    })
  }

  apiDelete(ctx, apiPath, mutation, mutParam) {
    if (this.dummy) {
      const resp = routeRequest('DELETE', this.dummyResponses, ctx, apiPath,
        null, this._dummySocketServer);
      if (mutation) ctx.commit(mutation, mutParam);
      return Promise.resolve(resp);
    }
    const conf = this.configExtractor ? this.configExtractor(ctx) : {};
    return new Promise((resolve, reject) => {
      this.ax.delete(this.baseUrl+apiPath, conf)
        .then(() => {
          if (mutation) ctx.commit(mutation, mutParam);
          resolve();
        }, reject)
    })
  }

  on(messageType, handler) {
    if (!this.socketUrl) {
      console.error("Not connected to socket");
      return;
    }
    if (this.dummy) {
      let handlers = this._dummySocketMessageHandlers[messageType];
      if (!handlers) {
        handlers = [];
        this._dummySocketMessageHandlers[messageType] = handlers;
      }
      handlers.push(handler);
    } else if (this.socket) {
      this.socket.on(messageType, handler);
    } else {
      console.error("Socket IO was not found");
    }
  }

  emit(ctx, messageType, apiParam, mutation, mutParam, respCombine) {
    if (!this.socketUrl) {
      console.error("Not connected to socket");
      return;
    }
    if (this.socketMessagePreprocessor) {
      apiParam = this.socketMessagePreprocessor(ctx, apiParam);
    }
    if (this.dummy) {
      let resp = routeRequest("SOCKET", this.dummyResponses, ctx, messageType,
         apiParam, this._dummySocketServer);

      if (mutation) ctx.commit(mutation, respCombine(mutParam, resp));
      return Promise.resolve(resp);
    } else if (this.socket) {
      return new Promise((resolve, reject) => {
        try {
          this.socket.emit(messageType, data, resp => {
            if (mutation) ctx.commit(mutation, respCombine(mutParam, resp));
            return resolve(resp);
          });
        } catch (err) {
          reject(err);
        }
      });

    } else {
      console.error("Socket IO was not found");
    }
  }

  _joinDummySocketRoom(room) {
    this._dummySocketRooms[room] = true;
    if (this._dummySocketChannel) {
      this._dummySocketChannel.postMessage({type: "ADD_TO_ROOM", room: room});
    }
  }

  _leaveDummySocketRoom(room) {
    delete this._dummySocketRooms[room];
    if (this._dummySocketChannel) {
      this._dummySocketChannel.postMessage({type: "REMOVE_FROM_ROOM", room: room});
    }
  }

  _dummySocketBroadcast(rooms = [], type, data) {
    if (!rooms) rooms = [];
    if (!Array.isArray(rooms)) {
      rooms = [rooms]
    }
    if (this._dummySocketChannel) {
      this._dummySocketChannel.postMessage({
        type: "MESSAGE",
        messageType: type,
        messageData: data,
        rooms
      })
    }
  }

  _handleDummySocketChannelMessage(ev) {
    if (ev.data) {
      if (ev.data.type === "ADD_TO_ROOM") {
        this._dummySocketRooms[ev.data.room] = true;
      } else if (ev.data.type === "REMOVE_FROM_ROOM") {
        delete this._dummySocketRooms[ev.data.room];
      } else if (ev.data.type === "MESSAGE") {

        // now check rooms
        let weAreInTargetRooms = !Array.isArray(ev.data.rooms) || ev.data.rooms.length === 0;
        if (!weAreInTargetRooms) {
          for (const room of ev.data.rooms) {
            if (this._dummySocketRooms[room]) {
              weAreInTargetRooms = true;
              break;
            }
          }
        }
        if (!weAreInTargetRooms) return;

        let handlers = this._dummySocketMessageHandlers[ev.data.messageType];
        if (handlers) {
          for (const handler of handlers) {
            handler(ev.data.messageData)
          }
        }
      }
    }
  }
}
