const operate = {
    state: {
      title:'',
      status: '',
      powerData: '',
      VoltageData: '',
      currentData: '',
      
    },
  
    mutations: {
      SET_STATUS: (state, status) => {
        state.status = status
      },
      SET_TITLE: (state, title) => {
        state.title = title
      },
      SET_POWER: (state, powerData) => {
        state.powerData = powerData
      },
      SET_Voltage: (state, VoltageData) => {
        state.VoltageData = VoltageData
      },
      SET_Current: (state, currentData) => {
        state.currentData = currentData
      },
    },
    
  }
  
  export default operate