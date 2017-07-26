<template>
<div>
  <div class="panel-music-bg-music" :class="{active: editorTheme.musicLink}" @click="playMusic(editorTheme, -1)">
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
      <span @click.stop="clearMusic(editorTheme, -1)"><i class="iconfont">&#xe62f;</i>清除</span>
    </div>
  </div>
  <ul class="panel-music-default-music">
    <li v-for="(list,index) in defaultMusicList" @click="toggleDefaultMusicList(list)">
      <input type="radio" v-model="defaultMusicStyle" :value="list.style">
      <span>{{list.style}}</span>
    </li>
  </ul>
  <ul class="panel-music-content">
    <li v-for="(list,index) in musicList" class="music-list" @click.stop="playMusic(list, index)" :class="{active: editorTheme.musicName===list.name}">
      <div class="left">
        <i class="iconfont" v-if="list.isPlaying">&#xe61b;</i>
        <i class="iconfont" v-else>&#xe74b;</i>
        <span class="music-name" :title="list.name">{{list.name}}</span>
      </div>
      <div class="right">
        <span class="play" v-if="editorTheme.musicName===list.name && list.isPlaying"><i class="iconfont">&#xe695;</i>暂停</span>
        <span class="play" v-else><i class="iconfont">&#xe674;</i>播放</span>
        <span @click.stop="clearMusic(list, index)" v-if="defaultMusicStyle === '默认'"><i class="iconfont">&#xe62f;</i>清除</span>
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
  import appConst from '../util/appConst'
  import Vue from 'vue'

  export default {
    data () {
      return {
        defaultMusicStyle: '默认'
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
      toggleDefaultMusicList (list) {
        this.$store.commit('CLEAN_MUSIC_LIST')
        list.music.map(item => {
          this.$store.commit('PUSH_MUSIC_LIST', item)
        })
        this.updateMusicListStatus()
      },
      fileUpload (event) { // 上传音乐
        let upload = true
        let file = event.target.files[0]
        if (!/^audio/.test(file.type)) {
          this.$message('请上传正确的音乐格式！')
          return
        }
        this.defaultMusicList[0].music.map(music => {
          if (file.name === music.name) {
            this.$message('不能上传同样的音乐')
            upload = false
            return
          }
        })
        if (upload) {
          let form = new window.FormData()
          form.append('inputFile', file)
          form.append('themeId', this.themeId)
          this.$store.dispatch('uploadMusic', form)
        }
      },
      playMusic (list, index) { // 播放音乐
        let audio = document.getElementById('audio')
        if (index > -1) { // 列表
          if (list.name === this.editorTheme.musicName) {
            this.toggleMusic(audio, index)
          } else {
            this.$store.dispatch('updateThemeMusic', {musicName: list.name, musicLink: appConst.BACKEND_DOMAIN + list.link, musicStyle: this.defaultMusicStyle})
            this.$store.dispatch('updateAllMusicStatus', {index: index, isPlaying: true})
            Vue.nextTick(() => {
              audio.play()
            })
          }
        } else { // 音乐栏
          if (list.musicName) {
            if (this.editorTheme.musicStyle === this.defaultMusicStyle) {
              this.musicList.map((item, itemIndex) => {
                if (list.musicName === item.name) {
                  this.toggleMusic(audio, itemIndex)
                  return
                }
              })
            } else {
              if (audio.paused) { // 播放
                audio.play()
                this.$store.dispatch('updateMusicStatus', true)
              } else { // 暂停
                audio.pause()
                this.$store.dispatch('updateMusicStatus', false)
              }
            }
          }
        }
      },
      toggleMusic (audio, itemIndex) {
        if (audio.paused) { // 播放
          audio.play()
          this.$store.dispatch('updateAllMusicStatus', {index: itemIndex, isPlaying: true})
        } else { // 暂停
          audio.pause()
          this.$store.dispatch('updateAllMusicStatus', {index: itemIndex, isPlaying: false})
        }
      },
      clearMusic (list, index) { // 删除音乐
        let audio = document.getElementById('audio')
        if (index > -1) {
          this.$store.dispatch('updateMusicList', index)
        }
        if (list.musicName || list.name === this.editorTheme.musicName) {
          audio.pause()
          this.$store.dispatch('updateThemeMusic', {musicName: null, musicLink: null, musicStyle: '默认'})
        }
      },
      updateMusicListStatus () { // 更新音乐列表状态
        if (this.musicList.length > 0 && this.defaultMusicStyle === this.editorTheme.musicStyle) {
          this.musicList.map((item, itemIndex) => {
            if (this.editorTheme.musicName === item.name) {
              this.$store.dispatch('updateMusicListStatus', {index: itemIndex, isPlaying: this.musicPlaying})
              return
            }
          })
        }
      },
      saveMusic () {
        // 暂停音乐
        let audio = document.getElementById('audio')
        if (this.editorTheme.musicName && !audio.paused) {
          audio.pause()
          this.$store.dispatch('updateMusicStatus', false)
          this.updateMusicListStatus()
        }
        this.$store.commit('SET_THEME_MUSIC_LIST', this.defaultMusicList[0].music)
      }
    },
    mounted () {
      this.$store.commit('CLEAN_MUSIC_LIST')
      if (this.editorTheme.uploadMusicList) {
        this.$store.commit('SET_DEFAULT_MUSIC_LIST', this.editorTheme.uploadMusicList)
      }
      if (this.editorTheme.musicStyle) {
        this.defaultMusicStyle = this.editorTheme.musicStyle
        this.defaultMusicList.map(item => {
          if (item.style === this.defaultMusicStyle) {
            this.toggleDefaultMusicList(item)
            return
          }
        })
      }
      if (this.editorTheme.musicName) {
        let audio = document.getElementById('audio')
        audio.pause()
        this.$store.dispatch('updateMusicStatus', false)
      }
    }
  }
</script>
