<template>
  <div class="container">
    <HeaderEdit :goback="save" />
    <div @click.stop="disActiveQuestion">
      <div class="main">
        <div class="tool-bar" :class="{fixed: scrolled > 70}">
          <div @click.stop="addRadioQuestion"><i class="el-icon-circle-check"></i>单选</div>
          <div @click.stop="addCheckQuestion"><i class="el-icon-circle-check"></i>多选</div>
          <div @click.stop="addTextQuestion"><i class="el-icon-edit"></i>单项填空</div>
          <el-button class="save" :plain="true" type="info" @click.stop="saveForm">保存</el-button>
        </div>
        <div class="editor">
          <div class="title"><input type="text" v-model="form.title"/></div>
          <p class="description"><textarea rows="4" v-model="form.description"/></p>
            <div class="form list-complete-item"  v-for="(item,index) in form.questions" v-bind:key="index">
              <TextInput :index="index" :question="item" v-if="item.qsType === 'text'"/>
              <Checkbox :index="index" :question="item" v-if="item.qsType === 'check'"/>
              <Checkbox :index="index" :question="item" v-if="item.qsType === 'radio'"/>
            </div>
        </div>
    </div>
     </div>
  </div>
</template>

<script>
import HeaderEdit from '../../components/HeaderEdit'
import TextInput from './textInput'
import Checkbox from './checkbox'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      scrolled: 0
    }
  },
  computed: {
    ...mapGetters({
      form: 'form/getForm',
      activeQuestionIndex: 'form/getActiveQuestionIndex'
    })
  },
  methods: {
    save () {
      this.$router.replace('formList')
    },
    addTextQuestion () {
      this.$store.commit('form/addTextQuestion')
    },
    addCheckQuestion () {
      this.$store.commit('form/addCheckQuestion')
    },
    addRadioQuestion () {
      this.$store.commit('form/addRadioQuestion')
    },
    saveForm () {
      this.$store.dispatch('form/updateForm').then(() => {
        this.$message('保存成功')
      })
    },
    disActiveQuestion () {
      this.$store.commit('form/disActiveQuestion', this.activeQuestionIndex)
    },
    handleScroll () {
      this.scrolled = window.scrollY
    }
  },
  components: {
    HeaderEdit, TextInput, Checkbox
  },
  mounted () {
    this.$store.dispatch('form/getFormById', this.$route.query.itemId)
    window.addEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang="less" scoped>
  .container {
    height: 100%
  }
  .fixed {
    position: fixed;
    width: 1024px;
    top:0px;
    z-index: 2;
  }
  .main {
    width: 1024px;
    margin: 10px auto;
    background: #fff;
    .tool-bar {
      height: 45px;
      background: #2B71C2;
      .save {
        float: right;
        margin-right: 10px;
        margin-top: 5px;
      }
      div {
        float: left;
        font-size: 14px;
        line-height: 45px;
        padding-right: 20px;
        cursor: pointer;
        color: #fff;
        i {
          padding: 0 10px;
        }
      }
      div:hover {
        background: #fff;
        color: #2B71C2;
        border: 1px solid #2B71C2;
      }
    }
    .editor {
      padding:20px 50px;
      .title {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        input {
          color: #000;
          border: 0;
          text-align: center;
        }
      }
      .description {
        font-size: 16px;
        padding:18px 0 22px 0;
        border-bottom: 1px dashed #979797;
        line-height: 1.5;
        textarea {
          color: #000;
          width: 100%;
          border: 0
        }
      }
    }
  }
</style>
