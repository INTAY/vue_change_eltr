const ops = {
  state: {
    detailOrder: false, //控制工单详情界面是否显示
    inspectionSite: false, //控制工单站巡视界面是否显示
    inspectionPlie: false, //控制工单桩巡视界面是否显示
    taskSet: null,//任务执行的ID
    orderDate:null,//工单数据
    sign: true,//标签（附属设施未处理问题）
    onBussin: '', //代办事项单个数据传送
    isChange: "", //从代办跳到具体事项的标识符
    isRun: false, //页面不改变模糊查询和总体查询失效标识符
  },

  mutations: {
    //控制工单详情界面是否显示
    set_detailOrder: (state, path) => {
      state.detailOrder = path
    },
    set_checkOrderOther(state, path) {
      switch (path) {
        case 1:
          state.inspectionSite = true;
          state.inspectionPlie = false;
          state.detailOrder = false;
          break;
        case 2:
          state.inspectionSite = false;
          state.inspectionPlie = true;
          state.detailOrder = false;
          break;
        default:
          state.inspectionSite = false;
          state.inspectionPlie = false;
          state.detailOrder = true;
      }
    },
    set_taskSet(state,path) {
      state.taskSet = path
    },
    //工单数据
    set_orderDate(state,path) {
      state.orderDate = path
    },
    //附属设施，标签
    set_Sign(state,path) {
      state.sign = path
    },
    //代办事项数据传送
    set_onBussin(state,path) {
      state.onBussin = path
    },
    //从代办跳到具体事项
    set_isChange(state,path) {
      
      state.isChange = path.id
    },
    //页面不改变模糊查询和总体查询失效标识符
    set_isRun(state,path) {
      state.isRun = path
    },
  },

}

export default ops