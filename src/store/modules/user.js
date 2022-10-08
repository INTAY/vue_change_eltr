
const user = {
  state: {
    permissions: [],
    pathData:{}, //
    pathUrl: '',
    changeTag:null,
    collageTag:false,
  },

  mutations: {
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_PATHURL: (state, path) => {
      state.pathUrl = path
    },
    SET_PATHDATA: (state, path) => {
      state.pathData = path
    },
    SET_CHANGETAG:(state, path) =>{
      state.changeTag = path
    },
    SET_COLLAGETAG:(state, path) =>{
      state.collageTag = path
    }
  },
  
}

export default user
