<template>
  <div class="wrap">
   <div class="main">
     <div class="content">
       <div class="title">选取模板</div>
       <div class="t_list">
         <div class="t_card" v-for="item in template" :key="item.loginId">
           <div class="img_wrap">
             <img :src="domain + '/screenshot/' + item._id + '.png'" alt="">
             <div class="cover">
               <div class="preview"><button @click="useTemplate(item)">使用模板</button></div>
             </div>
           </div>
           <div class="desc">
             <div class="card_title">{{item.title}}</div>
             <div class="card_desc">{{item.description}}</div>
           </div>
         </div>
       </div>
       <div class="close" @click="close">
         <i class="el-icon-close"></i>
       </div>
     </div>
   </div>
  </div>
</template>

<style lang="less" scoped>
 .wrap {
   position: fixed;
   top: 0;
   right: 0;
   bottom: 0;
   left: 0;
   background: rgba(74, 74, 74, 0.5);
   z-index: 1001;
   overflow-y: scroll;  justify-content: center;
   align-items: center;
   display: flex;
   .main {
     position: relative;
     width: 820px;
     height: 670px;
     border: 1px solid #d6d6d6;
     box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.2);
     border-radius: 5px;
     padding: 20px 10px;
     background-color: #f2f5f6;
   }
   .content {
     height: 600px;
     overflow-x: hidden;
     .title {
       padding-bottom: 10px;
       margin-bottom: 10px;
       border-bottom: 1px solid #ccc;
       font-weight: bold;
     }
     .t_list {
       display: flex;
       flex-wrap: wrap;
     }
     .t_card {
       margin-right: 10px;
       margin-bottom: 15px;
       .img_wrap:hover {
         .cover {
           display: block;
         }
       }
       .img_wrap {
         position: relative;
         width: 180px;
         height: 320px;
         img {
           width: 100%;
           height: 100%;
         }
         .cover {
           display: none;
           position: absolute;
           background: rgba(0, 0, 0, 0.5);
           width: 100%;
           height: 100%;
           top: 0;
           .preview {
             text-align: center;
             margin-top: 138px;
             button {
               border: none;
               padding: 5px 10px;
               font-size: 16px;
               color: #fff;
               cursor: pointer;
               background-color: #24afad;
             }
           }
         }
       }
       .desc {
         width: 180px;
         height: 98px;
         padding: 10px;
         background-color: #fff;
         box-sizing: border-box;
         position: relative;
         .card_title {
           color: #4a4a4a;
           font-size: 14px;
           width: 100%;
           overflow: hidden;
           text-overflow: ellipsis;
           white-space: nowrap;
         }
         .card_desc {
           color: #83817b;
           margin-top: 12px;
           font-size: 14px;
           max-height: 40px;
           overflow: hidden;
           line-height: 1.5;
         }
       }
     }
   }
   .close {
     position: absolute;
     color: #fff;
     right: -30px;
     top:0px;
     cursor: pointer;
   }
 }
</style>

<script>
  /**
   * Created by wesdint on 2018/3/16.
   */
  import * as api from '../../api/editor'
  import appConst from '../../util/appConst'
  import Theme from '../../model/Theme'
  export default {
    data () {
      return {
        template: [],
        domain: appConst.BACKEND_DOMAIN
      }
    },
    props: {

    },
    methods: {
      close () {
        this.$emit('closeSelectTemplate')
      },
      useTemplate (item) {
        var theme = new Theme({type: 'h5', templateId: item._id})
        theme.pages.push({elements: []})
        api.createByTemplate(theme).then(res => {
          this.close()
        })
      }
    },
    mounted () {
      api.getWorksTemplate().then(res => {
        this.template = res
      })
    }
  }
</script>
