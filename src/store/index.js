import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 存放歌曲 id
        topListIds: [],
        // 下一首歌 id
        nextId: ''
    },
    mutations: {
        // payload 为存放 歌曲 id 的数组
        INIT_TOPLISTIDS(state, payload){
            state.topListIds = payload
        },
        //  payload 为 当前歌曲 id
        GET_NEXTID(state, payload){
            for(let i = 0; i < state.topListIds.length; i++){
                if(state.topListIds[i].id == payload){
                    state.nextId = state.topListIds[i+1].id
                }
            }
        }
    }
})