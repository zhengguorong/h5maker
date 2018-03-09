<template>
<div class="container">
  <HeaderOpera @openChart="openChart"/>
  <div class="main">
    <template>
      <el-table
          :data="answerListArr"
          border
          style="width: 100%"
          max-height="300">
        <el-table-column
            prop="listIndex"
            label="序号"
            width="80">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="提交时间"
            width="220">
        </el-table-column>
        <el-table-column
            prop="timeStamp"
            label="答题时长(秒)"
            width="120">
        </el-table-column>
        <el-table-column
            prop="IP"
            label="所在地IP"
            width="300">
        </el-table-column>
        <el-table-column
            prop="sourcePlatform"
            label="来源渠道"
            width="180">
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="120">
          <template scope="scope">
            <el-button
                @click.native.prevent="checkAnswer1(scope.$index)"
                type="success"
                :plain="true"
                size="small">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template>
      <div style="margin:5px auto">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 20, 100, 200, 500, 1000]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </template>
    <div class="detail" v-if="answerListArr.length > 0 && detailDisplay">
      <p>答卷详情</p>
      <div class="title-wrap"><span class="mr-20">序号：{{ordinal}}</span> <span class="mr-20">提交时间：{{answerListArr[currentIndex].createDate}}</span><span class="mr-20">答题时长(秒)：{{answerListArr[currentIndex].timeStamp}}</span> <span class="mr-20">所在地IP：{{answerListArr[currentIndex].IP || '未知'}}</span><span class="mr-20">来源渠道：{{answerListArr[currentIndex].sourcePlatform || '未知'}}</span></div>
      <div class="content">
        <el-row v-for="(item, index) in QAArr">
          <el-col :span="12"><div class="grid-content">{{index + 1}}.{{item.question.content}} <span style="color: #0a58cc">{{item.question.type}}</span></div></el-col>
          <el-col :span="12" v-if="formList.length > 0 ">
           <div v-if="item.qsValidate === 'img'"><a :href="appConst.BACKEND_DOMAIN + imgItem" target="_blank" style="margin-right:8px;" v-for="imgItem in item.ask"><img :src="appConst.BACKEND_DOMAIN + imgItem" width="100" alt=""></a><span v-if="item.ask.length === 0" style="font-size:14px">未上传图片</span></div>
           <div v-if="item.qsValidate === 'pureFile'"><a :href="appConst.BACKEND_DOMAIN + fileItem.path" target="_blank" v-for="(fileItem, index) in item.ask" style="margin-right:8px;color: #0a58cc">{{fileItem.name}}</a><span v-if="item.ask.length === 0" style="font-size:14px">未上传文件</span></div>
           <div class="grid-content" v-if="item.qsType !== 'file'">{{item.ask.length == 0 ? '未填写' : item.ask}}</div>
          </el-col>
          <el-col :span="12" v-else>
            <div class="grid-content">{{item.ask.length == 0 ? '未填写' : item.ask}}</div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
  <AnswerCharts v-if="answerChartsDisplay" @closeView="answerChartsDisplay = false"></AnswerCharts>
</div>
</template>

<style lang="less" scoped>
.container{
  height:100%;
}
  .main{
    width: 1024px;
    margin: 10px auto;
  }
  .mr-20{
    margin-right:20px;
  }
  .title-wrap{
    padding: 20px;
    font-size: 15px;
    border-bottom: 2px solid #e5e5e5;
  }
.detail {
  background: #f6f6f6;
  padding: 10px 5px;
}
.el-row {
  padding: 10px 15px;
&:last-child {
   margin-bottom: 0;
 }
}
.grid-content{
  padding-right:10px;
  font-size: 14px;
  color: #333
}
</style>

<script>
  /**
   * Created by Wesdint on 2017/7/14.
   */
  import HeaderOpera from '../../components/HeaderOpera.vue'
  import AnswerCharts from '../../components/AnswerCharts.vue'
  import appConst from '../../util/appConst'
  import api from '../../api/form'
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        appConst: appConst,
        currentPage: 1,
        pageSize: 5,
        answerListArr: [],
        answerCollection: [],
        QAArr: [],
        questionInfoList: [],
        total: 0,
        ordinal: 1,
        currentIndex: 0,
        detailDisplay: false,
        answerChartsDisplay: false
      }
    },
    computed: {
      ...mapGetters({
        formList: 'form/getFormList'
      })
    },
    methods: {
      openChart (bool) {
        this.answerChartsDisplay = bool
      },
      // 2018/03/09 对数据库字段进行更改后，查看问卷调用此方法
      checkAnswer1 (index) {
        this.currentIndex = index
        this.ordinal = this.pageSize * (this.currentPage - 1) + index + 1
        this.QAArr = this.answerCollection[index].result
        this.detailDisplay = true
        for (let i = 0; i < this.QAArr.length; i++) {
          let qaItem = this.QAArr[i]
          if (qaItem.qsType === 'text' && qaItem.qsValidate === 'date') {
            let dateStr = ''
            if (Object.prototype.toString.call(qaItem.ask) !== '[object Array]') continue
            qaItem.ask.forEach((dateItem) => {
              dateStr = dateStr + '-' + dateItem
            })
            if (Object.prototype.toString.call(qaItem.ask) !== '[object Object]') {
              qaItem.question = {
                content: qaItem.question,
                type: '【填空题】'
              }
            }
            qaItem.ask = dateStr.replace('-', '')
          } else if (qaItem.qsType === 'check') {
            let checkboxStr = ''
            if (Object.prototype.toString.call(qaItem.ask) !== '[object Array]') continue
            qaItem.ask.forEach((checkboxItem) => {
              checkboxStr = checkboxStr + ' | ' + checkboxItem
            })
            if (Object.prototype.toString.call(qaItem.ask) !== '[object Object]') {
              qaItem.question = {
                content: qaItem.question,
                type: '【多选题】'
              }
            }
            qaItem.ask = checkboxStr
          } else if (qaItem.qsType === 'file' && qaItem.qsValidate === 'img') {
            if (Object.prototype.toString.call(qaItem.question) !== '[object Object]') {
              qaItem.question = {
                content: qaItem.question,
                type: '【图片上传】'
              }
            }
          } else if (qaItem.qsType === 'file' && qaItem.qsValidate === 'pureFile') {
            if (Object.prototype.toString.call(qaItem.question) !== '[object Object]') {
              qaItem.question = {
                content: qaItem.question,
                type: '【文件上传】'
              }
            }
          } else if (qaItem.qsType === 'radio') {
            if (Object.prototype.toString.call(qaItem.question) !== '[object Object]') {
              qaItem.question = {
                content: qaItem.question,
                type: '【单选题】'
              }
            }
          } else {
            if (Object.prototype.toString.call(qaItem.question) !== '[object Object]') {
              qaItem.question = {
                content: qaItem.question,
                type: '【填空题】'
              }
            }
          }
        }
      },
      checkAnswer (index) {
        this.currentIndex = index
        this.ordinal = this.pageSize * (this.currentPage - 1) + index + 1
        this.QAArr = this.answerCollection[index].result
        this.detailDisplay = true
        if (this.formList.length > 0) {
          for (let i = 0; i < this.formList.length; i++) {
            if (this.formList[i]._id === this.$route.query.formId) {
              this.questionInfoList = this.formList[i].questions
            }
          }
          for (let j = 0; j < this.QAArr.length; j++) {
            let questionInfo = this.questionInfoList[j]
            // /////////////// //
            if (questionInfo.qsType === 'text' && questionInfo.validate === 'date') {
              let dateStr = ''
              if (Object.prototype.toString.call(this.QAArr[j].ask) !== '[object Array]') continue
              this.QAArr[j].ask.forEach((dateItem) => {
                dateStr = dateStr + '-' + dateItem
              })
              if (Object.prototype.toString.call(this.QAArr[j].ask) !== '[object Object]') {
                this.QAArr[j].question = {
                  content: this.QAArr[j].question,
                  type: '【填空题】'
                }
              }
              this.QAArr[j].ask = dateStr.replace('-', '')
            } else if (questionInfo.qsType === 'check') {
              let checkboxStr = ''
              if (Object.prototype.toString.call(this.QAArr[j].ask) !== '[object Array]') continue
              this.QAArr[j].ask.forEach((checkboxItem) => {
                checkboxStr = checkboxStr + ' | ' + checkboxItem
              })
              if (Object.prototype.toString.call(this.QAArr[j].ask) !== '[object Object]') {
                this.QAArr[j].question = {
                  content: this.QAArr[j].question,
                  type: '【多选题】'
                }
              }
              this.QAArr[j].ask = checkboxStr
            } else if (questionInfo.qsType === 'file' && questionInfo.validate === 'img') {
              if (Object.prototype.toString.call(this.QAArr[j].question) !== '[object Object]') {
                this.QAArr[j].question = {
                  content: this.QAArr[j].question,
                  type: '【图片上传】'
                }
              }
            } else if (questionInfo.qsType === 'file' && questionInfo.validate === 'pureFile') {
              if (Object.prototype.toString.call(this.QAArr[j].question) !== '[object Object]') {
                this.QAArr[j].question = {
                  content: this.QAArr[j].question,
                  type: '【文件上传】'
                }
              }
            } else if (questionInfo.qsType === 'radio') {
              if (Object.prototype.toString.call(this.QAArr[j].question) !== '[object Object]') {
                this.QAArr[j].question = {
                  content: this.QAArr[j].question,
                  type: '【单选题】'
                }
              }
            } else {
              if (Object.prototype.toString.call(this.QAArr[j].question) !== '[object Object]') {
                this.QAArr[j].question = {
                  content: this.QAArr[j].question,
                  type: '【填空题】'
                }
              }
            }
            // //////////////// //
          }
        }
      },
      handleSizeChange (val) {
        this.detailDisplay = false
        this.pageSize = val
        this.loadData()
      },
      handleCurrentChange (val) {
        this.detailDisplay = false
        this.currentPage = val
        this.loadData()
      },
      loadData () {
        api.getAnswer({
          id: this.$route.query.formId,
          pageSize: this.pageSize,
          pageIndex: this.currentPage
        }).then((result) => {
          this.answerCollection = result.records
          this.total = result.count
          this.answerListArr = result.records.map((item, index) => { return {listIndex: this.pageSize * (this.currentPage - 1) + index + 1, createDate: new Date(item.createDate).toLocaleString().replace(/:\d{1,2}$/, ' '), IP: item.ip || '未知', sourcePlatform: item.sourcePlatform || '未知', timeStamp: item.timeStamp || '未知'} })
        })
      }
    },
    mounted () {
      if (this.formList.length === 0) {
        this.$router.replace('/formList')
      }
      this.loadData()
    },
    components: {HeaderOpera, AnswerCharts}
  }
</script>
