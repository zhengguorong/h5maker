import * as api from '../../api/form'
import FormModel from '../../model/Form'
import TextQuestionModel from '../../model/TextQuestion'
import SelectedQuestionModel from '../../model/SelectedQuestion'
import CheckModel from '../../model/Check'
import FileQuestionModel from '../../model/FileQuestion'
import tools from '../../util/tools'
export default {
  namespaced: true,
  state: {
    formList: [],  // 问卷列表
    form: new FormModel(), // 正在编辑的表单
    deletedQs: [], // 缓存删除的问题
    activeQuestionIndex: -1
  },
  actions: {
    // 删除问卷
    deleteForm (form) {
      api.deleteForm(form)
    },
    // // 创建问卷
    // createForm (form) {
    //   api.createForm(form)
    // },
    // 获取问卷列表
    getFormList ({commit}) {
      api.getFormList().then(res => {
        commit('setFormList', res)
      })
    },
    // 获取表单
    getFormById ({commit, state}, id) {
      api.getFormById(id).then(res => {
        // 初始化选中元素
        res.questions.forEach((item, index) => {
          if (item.isExist && item.isActive) state.activeQuestionIndex = index
        })
        commit('setForm', new FormModel(res))
      })
    },
    // 更新表单
    updateForm ({commit, state}) {
      var submitFrom = tools.deepClone(state.form)
      for (let qs of submitFrom.questions) {
        if (qs.isNew) delete qs.isNew
      }
      if (state.deletedQs.length > 0) {
        submitFrom.questions = submitFrom.questions.concat(state.deletedQs)
      }
      return api.updateForm(submitFrom).then(res => {
        commit('setForm', new FormModel(res))
      })
    },
    savePic ({commit}, data) {
      return api.uploadPic(data)
    },
    addTextQuestion ({commit}) {
      let textQuestion = new TextQuestionModel()
      commit('addQuestion', textQuestion)
    },
    addCheckQuestion ({commit}) {
      let checkQuestion = new SelectedQuestionModel({qsType: 'check'})
      commit('addQuestion', checkQuestion)
    },
    addFileQuestion ({commit}) {
      let fileQuestion = new FileQuestionModel()
      commit('addQuestion', fileQuestion)
    },
    addRadioQuestion ({commit}) {
      let radioQuestion = new SelectedQuestionModel({qsType: 'radio'})
      commit('addQuestion', radioQuestion)
    }
  },
  getters: {
    getFormList (state) {
      return state.formList
    },
    getForm (state) {
      return state.form
    },
    getActiveQuestionIndex (state) {
      return state.activeQuestionIndex
    }
  },
  mutations: {
    setFormList (state, list) {
      state.formList = list
    },
    setForm (state, form) {
      // 把删除的问题筛分出来
      let existQs = []
      let deletedQs = []
      for (let qs of form.questions) {
        if (qs.isExist) {
          existQs.push(qs)
        } else {
          deletedQs.push(qs)
        }
      }
      form.questions = existQs
      state.form = form
      state.deletedQs = deletedQs
    },
    createForm (state, form) {
      state.formList.push(form)
    },
    deleteForm (state, index) {
      state.formList.splice(index, 1)
    },
    activeQuestion (state, index) {
      if (state.activeQuestionIndex !== -1) state.form.questions[state.activeQuestionIndex].isActive = false
      if (state.form.questions.length > 0) {
        state.form.questions[index].isActive = true
        state.activeQuestionIndex = index
      }
    },
    disActiveQuestion (state, index) {
      if (state.activeQuestionIndex !== -1) state.form.questions[index].isActive = false
      state.activeQuestionIndex = -1
    },
    addQuestion (state, question) {
      state.form.questions.push(question)
      // if (state.activeQuestionIndex > -1) {
      //   state.form.questions.splice(state.activeQuestionIndex + 1, 0, question)
      // } else {
      //   state.form.questions.push(question)
      // }
    },
    copyQuestion (state, index) {
      let copyObject = JSON.parse(JSON.stringify(state.form.questions[index]))
      copyObject.isActive = false
      state.form.questions.push(copyObject)
    },
    saveQuestion (state, {question, index}) {
      state.form.questions[index] = question
    },
    deleteQuestion (state, index) {
      let temQs = state.form.questions[index]
      if (!temQs.isNew) {
        temQs.isExist = false
        state.deletedQs.push(temQs)
      }
      state.form.questions.splice(index, 1)
    },
    moveUpQuestion (state, index) {
      if (index === 0) return
      let targetQuestion = state.form.questions[index - 1]
      state.form.questions.splice(index - 1, 1, state.form.questions[index])
      state.form.questions.splice(index, 1, targetQuestion)
    },
    moveDownQuestion (state, index) {
      if (index === state.form.questions.length - 1) return
      let targetQuestion = state.form.questions[index + 1]
      state.form.questions.splice(index + 1, 1, state.form.questions[index])
      state.form.questions.splice(index, 1, targetQuestion)
    },
    moveTopQuestion (state, index) {
      let targetQuestion = state.form.questions[0]
      state.form.questions.splice(0, 1, state.form.questions[index])
      state.form.questions.splice(index, 1, targetQuestion)
    },
    moveBottomQuestion (state, index) {
      let length = state.form.questions.length
      let targetQuestion = state.form.questions[length - 1]
      state.form.questions.splice(length - 1, 1, state.form.questions[index])
      state.form.questions.splice(index, 1, targetQuestion)
    },
    addAsk (state, {questionIndex, askIndex}) {
      state.form.questions[questionIndex].askList.splice(askIndex + 1, 0, new CheckModel())
    },
    deleteAsk (state, {questionIndex, askIndex}) {
      state.form.questions[questionIndex].askList.splice(askIndex, 1)
    },
    moveUpAsk (state, {questionIndex, askIndex}) {
      let askList = state.form.questions[questionIndex].askList
      let targetAsk = askList[askIndex - 1]
      askList.splice(askIndex - 1, 1, askList[askIndex])
      askList.splice(askIndex, 1, targetAsk)
    },
    moveDownAsk (state, {questionIndex, askIndex}) {
      let askList = state.form.questions[questionIndex].askList
      let targetAsk = askList[askIndex + 1]
      askList.splice(askIndex + 1, 1, askList[askIndex])
      askList.splice(askIndex, 1, targetAsk)
    }
  }

}
