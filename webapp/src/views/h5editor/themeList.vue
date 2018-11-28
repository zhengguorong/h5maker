<template>
  <div>
    <HeaderBar/>
    <div class="my-themes">
      <div class="container">
        <ul class="theme-list">
          <li class="theme-item create" @click="create">
            <div class="create-area">
              <p>创建作品</p>
            </div>
          </li>
          <template v-for="item in list">
            <li class="theme-item">
              <div class="thumb" >
                <img src="../../assets/images/default.png" alt="">
                <div class="cover">
                  <div class="toolbar">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                      <i @click="toEditor(item)" class="el-icon-edit"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                      <i @click.stop="deleteTheme(item)" class="el-icon-delete"></i>
                    </el-tooltip>
                  </div>
                  <div class="preview" @click="showPreView(item._id)"><span>预 览</span></div>
                </div>
              </div>
              <div class="footer">
                <div class="title">{{item.title}}</div>
                <div class="content">{{item.description}}</div>
                <div class="content">创建于：{{timeFormat(item.createDate)}}</div>
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
  import tools from '../../util/tools'
  import PreView from '../../components/PreView'
  export default {
    data () {
      return {
        isShowPreView: false,
        itemId: null
      }
    },
    computed: {
      list () {
        return this.$store.state.editor.themeList
      }
    },
    mounted () {
      this.$store.dispatch('getUserThemeList', 'h5')
    },
    methods: {
      toEditor (item) {
        this.$store.dispatch('setEditorTheme', item)
        this.$store.dispatch('setEditorPage', item.pages[0])
        this.$router.replace({ path: '/h5editor', query: { itemId: item._id } })
      },
      deleteTheme (item) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('deleteTheme', item)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      create () {
        this.$store.dispatch('createTheme', 'h5')
        this.$store.dispatch('addPage')
        let $this = this
        this.$store.dispatch('saveTheme', tools.vue2json(this.$store.state.editor.editorTheme)).then(() => {
          this.$router.replace({ path: '/h5editor', query: { itemId: $this.$store.state.editor.editorTheme._id } })
        })
      },
      showPreView (itemId) {
        this.isShowPreView = true
        this.itemId = itemId
      },
      timeFormat (date) {
        const dateTime = new Date(date)
        const displayTime = `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${dateTime.getDate()}`
        console.log(displayTime)
        return displayTime
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
