const open = function () {
    const vm = this
    return [
      {
        modules: [
          {
            id: 'ScheduledTask',  //计划工单任务审批
            refName: 'ScheduledTask',
            relPath:'operBeijing/planToTour/ScheduledTask',
            component: () => import('../views/operBeijing/planToTour/ScheduledTask.vue')
          },
          {
            id: 'stopRun',
            refName: 'stopRun',
            relPath:'operBeijing/planToTour/stopRun',
            component: () => import('../views/operBeijing/planToTour/stopRun.vue')
          },
          {
            id: 'restratRun',
            refName: 'restratRun',
            relPath:'operBeijing/planToTour/restratRun',
            component: () => import('../views/operBeijing/planToTour/restratRun.vue')
          },
          {
            id: 'PeriodicTask',  //周期保养任务审批
            refName: 'PeriodicTask',
            relPath:'operBeijing/PeriodicMaintenance/PeriodicTask',
            component: () => import('../views/operBeijing/PeriodicMaintenance/PeriodicTask.vue')
          },
        ]
      }
    ]
  }
  
  export const openModules = vm => {
    return open.call(vm)
  }