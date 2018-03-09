<template>
  <div>
    <HeaderBar/>
    <div class="my-themes">
      <div class="container">
        <ul class="theme-list">
          <li class="theme-item create" @click="create">
            <div class="create-area">
              <p>创建问卷</p>
            </div>
          </li>
          <template v-for="(item,index) in list">
            <li class="theme-item">
              <div class="thumb" >
                <img src="../../assets/images/default.png" alt="">
                <div class="cover">
                  <div class="toolbar">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                      <i @click="toEditor(item)" class="el-icon-edit"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                      <i @click.stop="deleteTheme(item,index)" class="el-icon-delete"></i>
                    </el-tooltip>
                  </div>
                  <div class="preview" @click="showPreView(item._id)" v-if="item.questions.length > 0"><span>预 览</span></div>
                  <div class="preview" @click="toEditor(item)" v-else><span>编 辑</span></div>
                  <div class="footbar" style="color:#fff;text-align: center;margin-top:50px;cursor: pointer" @click="$router.replace({ path: '/checkAnswer', query: { formId: item._id }})">答卷数量：{{item.answerNum || 0}}</div>
                </div>
              </div>
              <div class="footer">
                <div class="title">{{item.title}}</div>
                <div class="content">{{item.description}}</div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <PreView :itemId="itemId" @hideView="isShowPreView=false" v-if="isShowPreView"/>
  </div>
</template>

<script>
  import HeaderBar from '../../components/HeaderBar'
  import PreView from '../../components/PreView'
  import {mapGetters} from 'vuex'
  import api from '../../api/form'
  import FormModel from '../../model/Form'
  export default {
    data () {
      return {
        isShowPreView: false,
        itemId: null
      }
    },
    computed: {
      ...mapGetters({
        list: 'form/getFormList'
      })
    },
    mounted () {
      this.$store.dispatch('form/getFormList')
    },
    methods: {
      toEditor (item) {
        this.$router.push({ path: '/formeditor', query: { itemId: item._id } })
      },
      deleteTheme (item, index) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.deleteForm(item).then(res => {
            this.$store.commit('form/deleteForm', index)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      create () {
        let form = new FormModel()
        api.createForm(form).then(res => {
          this.$store.commit('form/createForm', new FormModel(res))
        })
      },
      showPreView (itemId) {
        this.isShowPreView = true
        this.itemId = itemId
      }
    },
    components: {
      HeaderBar, PreView
    }
  }
</script>

<style lang="less" scoped>
  .my-themes {
    width: 100%;
    height: 100%;
    background-color: #f2f5f6;
  }

  .my-themes .container {
    width: 1024px;
    margin: 0 auto;
    padding-top: 20px;
  }

  .my-themes .theme-list {
    overflow: hidden;
  }

  .theme-item {
    width: 230px;
    height: 328px;
    float: left;
    margin-right: 20px;
    margin-bottom: 20px;
    background: #fff;
  }

  .theme-item .thumb img {
    width: 100%;
    height: 230px;
  }
  .thumb {
    position: relative;
    .cover {
      display: none;
      position: absolute;
      background: #000;
      opacity: 0.5;
      width: 100%;
      height: 100%;
      top:0;
      .toolbar {
        color: #fff;
        text-align: right;
        cursor: pointer;
        padding: 10px;
        font-size: 18px;
        i {
          margin: 5px;
        }
      }
      .preview {
        text-align: center;
        margin-top:70px;
        span {
          border: 1px solid #fff;
          padding: 5px 10px;
          font-size: 20px;
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
  .thumb:hover {
    .cover {
      display: block;
    }
  }
  .theme-item .footer {
    height: 98px;
    padding: 10px;
    background-color: #fff;
    box-sizing: border-box;
    position: relative;
  }

  .theme-item .footer > .title {
    color: #4a4a4a;
    font-size: 14px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .theme-item .footer > .content {
    color: #83817b;
    margin-top: 12px;
    font-size: 14px;
    max-height: 40px;
    overflow: hidden;
    line-height: 1.5;
  }
  .footer .delete {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }

  .theme-item.create {
    text-align: center;
  }

  .theme-item.create .create-area p {
    font-size: 20px;
    cursor: pointer;
    margin-top: 100px;
  }
</style>
