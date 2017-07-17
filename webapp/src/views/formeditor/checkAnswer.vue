<template>
<div class="container">
  <HeaderOpera/>
  <div class="main">
    <template>
      <el-table
          :data="answerListArr"
          border
          style="width: 100%"
          max-height="300">
        <el-table-column
            prop="createDate"
            label="提交时间"
            width="250">
        </el-table-column>
        <el-table-column
            prop="IP"
            label="所在地IP"
            width="400">
        </el-table-column>
        <el-table-column
            prop="sourceChannel"
            label="来源渠道"
            width="200">
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="120">
          <template scope="scope">
            <el-button
                @click.native.prevent="checkAnswer(scope.$index)"
                type="text"
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
            :page-size="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </template>
    <div class="detail">
      <p>答卷详情</p>
      <div class="title-wrap"><span class="mr-20">序号：1</span> <span class="mr-20">提交时间：2016/12/16 21:34:43</span> <span class="mr-20">所在地IP：122.12.23.43(广州)</span><span class="mr-20">来源渠道：手机</span><span class="mr-20">来源详情：微信昵称</span></div>
      <div class="content">
        <el-row v-for="(item, index) in QAArr">
          <el-col :span="12"><div class="grid-content">{{index + 1}}.{{item.question}}</div></el-col>
          <el-col :span="12"><div class="grid-content">{{item.ask}}</div></el-col>
        </el-row>
      </div>
    </div>
  </div>
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
    border-bottom: 1px solid #e5e5e5;
  }
.el-row {
  padding: 10px 15px;
&:last-child {
   margin-bottom: 0;
 }
}
.grid-content{
  padding-right:10px;
}
</style>

<script>
  /**
   * Created by Wesdint on 2017/7/14.
   */
  import HeaderOpera from '../../components/HeaderOpera.vue'
  import api from '../../api/form'
  export default {
    data () {
      return {
        currentPage: 1,
        pageSize: 5,
        answerListArr: [],
        answerCollection: [],
        QAArr: [],
        total: 0
      }
    },
    methods: {
      checkAnswer (index) {
        this.QAArr = this.answerCollection[index].result
      },
      handleSizeChange (val) {
        this.pageSize = val
      },
      handleCurrentChange (val) {
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
          this.answerListArr = result.records.map((item, index) => { return {createDate: item.createDate, IP: '127.0.0.1（本地）', sourceChannel: '微信'} })
        })
      }
    },
    mounted () {
      this.loadData()
    },
    components: {HeaderOpera}
  }
</script>
