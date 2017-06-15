import api from '../../api/form'
export default {
  namespaced: true,
  state: {
    formList: []  // 问卷列表
  },
  actions: {
    // 删除问卷
    deleteForm (from) {
      api.deleteForm(from)
    },
    // 创建问卷
    createForm (form) {
      api.createForm(form)
    },
    // 获取问卷列表
    getFormList ({commit}) {
      api.getFormList().then(res => {
        commit('setFormList', res)
      })
    }
  },
  getters: {
    getFormList (state) {
      return state.formList
    }
  },
  mutations: {
    setFormList (state, list) {
      state.formList = list
    },
    createForm (state, form) {
      state.formList.push(form)
    },
    deleteForm (state, index) {
      state.formList.splice(index, 1)
    }
  }
}
