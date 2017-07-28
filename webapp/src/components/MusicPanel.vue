<template>
<div>
  <div class="panel-music-bg-music" :class="{active: editorTheme.musicLink}" @click="playMusic()">
    <div class="left">
      <audio :src="editorTheme.musicLink" id="audio" loop="true"></audio>
      <i class="iconfont" v-if="musicPlaying">&#xe61b;</i>
      <i class="iconfont" v-else>&#xe74b;</i>
      <span v-if="!editorTheme.musicLink">未选择音乐</span>
      <span v-if="editorTheme.musicName" :title="editorTheme.musicName">{{editorTheme.musicName}}</span>
    </div>
    <div class="right">
      <span class="play" v-if="editorTheme.musicName && this.musicPlaying"><i class="iconfont">&#xe695;</i>暂停</span>
      <span class="play" v-else><i class="iconfont">&#xe674;</i>播放</span>
      <span @click.stop="delMusic(editorTheme, -1)"><i class="iconfont">&#xe62f;</i>清除</span>
    </div>
  </div>
  <ul class="panel-music-default-music">
    <li v-for="(list,index) in defaultMusicList" @click="toggleDefaultMusicList(list)">
      <input type="radio" v-model="defaultMusicStyle" :value="list.style">
      <span>{{list.style}}</span>
    </li>
  </ul>
  <ul class="panel-music-content">
    <li v-for="(list,index) in musicList" class="music-list" @click.stop="playMusicList(list, index)" :class="{active: editorTheme.musicName===list.name}">
      <div class="left">
        <i class="iconfont" v-if="list.isPlaying">&#xe61b;</i>
        <i class="iconfont" v-else>&#xe74b;</i>
        <span class="music-name" :title="list.name">{{list.name}}</span>
      </div>
      <div class="right">
        <span class="play" v-if="editorTheme.musicName===list.name && list.isPlaying"><i class="iconfont">&#xe695;</i>暂停</span>
        <span class="play" v-else><i class="iconfont">&#xe674;</i>播放</span>
        <span @click.stop="delMusic(list, index)" v-if="defaultMusicStyle === '默认'"><i class="iconfont">&#xe62f;</i>清除</span>
      </div>
    </li>
  </ul>
  <div class="panel-music-upload" v-if="defaultMusicStyle === '默认'">
    <input type="file" name="inputFile" @change="fileUpload"/>
    <el-button type="primary" icon="upload2">上传音乐</el-button>
  </div>
</div>
</template>

<style lang="less" scoped>
  .play{
    margin-right:10px;
  }
  .iconfont{
    padding-right:10px;
  }
  .panel-music-bg-music{
    height:60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom:1px solid #ddd;
    cursor:pointer;
    font-size:16px;
    .left{
      flex:auto;
      display:flex;
      overflow:hidden;
      margin-right:10px;
      span{
        flex:auto;
        overflow:hidden;
        text-overflow: ellipsis;
      }
    }
    .right{
      flex:none;
    }
  }
  .active{
    color:#50bfff;
  }
  .panel-music-default-music{
    padding-bottom:15px;
    display:flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    border-bottom:1px solid #ddd;
    li{
      font-size: 14px;
      cursor:pointer;
      position:relative;
      span{
        display:block;
        border:1px solid #aaa;
        border-radius:4px;
        padding:5px 8px;
        margin:15px 10px 0;
      }
      input[type='radio']{
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:4;
        cursor:pointer;
      }
      input[type='radio']:checked + span{
        background:#50bfff;
        color:#fff;
        border:1px solid #50bfff;
      }
    }
  }
  .panel-music-upload{
    position:relative;
    margin-top:10px;
    input[type='file']{
      opacity:0;
      position:absolute;
      top:0;
      left:0;
      width:108px;
      height:36px;
      z-index:2;
      cursor:pointer;
    }
  }
  .panel-music-content{
    li{
      height:40px;
      display:flex;
      align-items: center;
      justify-content: space-between;
      cursor:pointer;
      padding:0 15px;
      font-size:14px;
      .left{
        flex:auto;
        display:flex;
        overflow:hidden;
        margin-right:10px;
        .music-name{
          flex:auto;
          overflow:hidden;
          text-overflow: ellipsis;
        }
      }
      .right{
        flex:none;
      }
    }
  }
</style>

<script>
  /**
   * Created by tracy on 2017/7/25.
   */
  export default {
    data () {
      return {
        defaultMusicStyle: '默认'
      }
    },
    watch: {
      musicPlaying (val) {
        let audio = document.getElementById('audio')
        if (val) {
          audio.play()
        } else {
          audio.pause()
        }
      }
    },
    computed: {
      themeId () {
        return this.$store.state.editor.editorTheme._id
      },
      editorTheme () {
        return this.$store.state.editor.editorTheme
      },
      musicList () {
        return this.$store.state.editor.musicList
      },
      musicPlaying () {
        return this.$store.state.editor.musicPlaying
      },
      defaultMusicList () {
        return this.$store.state.editor.defaultMusicList
      }
    },
    methods: {
      fileUpload (event) { // 上传音乐
        let file = event.target.files[0]
        this.$store.dispatch('uploadMusic', file)
      },
      toggleDefaultMusicList (list) { // 切换音乐风格
        this.$store.dispatch('toggleDefaultMusicList', {list, defaultMusicStyle: this.defaultMusicStyle})
      },
      playMusic () { // 播放音乐栏
        this.$store.dispatch('playMusic', this.defaultMusicStyle)
      },
      playMusicList (list, index) { // 播放音乐列表
        this.$store.dispatch('playMusicList', {list, index, defaultMusicStyle: this.defaultMusicStyle}).then((res) => {
          if (!res) return
          this.$store.dispatch('updateMusicStatus', {index: index, isPlaying: true})
          document.getElementById('audio').play()
        })
      },
      delMusic (list, index) { // 删除音乐
        this.$store.dispatch('delMusic', {list, index})
      },
      saveMusic () { // 保存音乐
        this.$store.dispatch('saveMusic', this.defaultMusicStyle)
      }
    },
    mounted () {
      this.defaultMusicStyle = this.editorTheme.musicStyle
      this.$store.dispatch('initMusic', this.defaultMusicStyle)
    }
  }
</script>
