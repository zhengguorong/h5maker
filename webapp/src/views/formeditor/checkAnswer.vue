<template>
<div class="container">
  <HeaderOpera/>
  <div class="main">
    <template>
      <el-table
          :data="tableData4"
          border
          style="width: 100%"
          max-height="300">
        <el-table-column
            prop="date"
            label="日期"
            width="150">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            width="120">
        </el-table-column>
        <el-table-column
            prop="province"
            label="省份"
            width="120">
        </el-table-column>
        <el-table-column
            prop="city"
            label="市区"
            width="120">
        </el-table-column>
        <el-table-column
            prop="address"
            label="地址"
            width="300">
        </el-table-column>
        <el-table-column
            prop="zip"
            label="邮编"
            width="120">
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
            :total="1000">
        </el-pagination>
      </div>
    </template>
    <div class="detail">
      <p>答卷详情</p>
      <div class="title-wrap"><span class="mr-20">序号：1</span> <span class="mr-20">提交时间：2016/12/16 21:34:43</span> <span class="mr-20">所在地IP：122.12.23.43(广州)</span><span class="mr-20">来源渠道：手机</span><span class="mr-20">来源详情：微信昵称</span></div>
      <div class="content">
        <el-row>
          <el-col :span="12"><div class="grid-content">1.你的姓名是：</div></el-col>
          <el-col :span="12"><div class="grid-content">曾文东</div></el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><div class="grid-content">2.你在哪里工作：</div></el-col>
          <el-col :span="12"><div class="grid-content">蓝月亮</div></el-col>
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
  export default {
    data () {
      return {
        currentPage: 4,
        tableData4: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-06',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }]
      }
    },
    methods: {
      checkAnswer (index) {
        console.log(index)
      },
      handleSizeChange () {

      },
      handleCurrentChange () {

      }
    },
    components: {HeaderOpera}
  }
</script>
