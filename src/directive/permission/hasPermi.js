import {Message} from 'element-ui'
import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const all_permission = "";
    const permissions = store.getters && store.getters.permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value
      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })
      if (!hasPermissions) {
      	Message({
		      message: `您没有${el.innerText}的操作权限标签值`,
		      type: 'error',
		});
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      Message({
	      message: `${el.innerText}没有设置操作权限标签值`,
	      type: 'error',
	  });
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
