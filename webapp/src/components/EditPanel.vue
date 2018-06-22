<template>
  <div class="panel panel-edit">
    <div class="panel-tab clearfix">
      <div class="tab"
           :class="{ active: panelTabState === 0 }"
           @click="function () { panelTabState = 0 }">
        <span v-show="panelState === 11">文本</span>
        <span v-show="panelState === 12">元素</span>
      </div>
      <div class="tab"
           :class="{ active: panelTabState === 1 }"
           @click="function () { panelTabState = 1 }">动作</div>
    </div>
    <div v-show="panelTabState === 0">
      <!-- 文字编辑界面特有控件 -->
      <div v-show="panelState === 11">
        <div class="item">
          <label>文本内容</label>
          <div class="content">
            <el-input class="input"
                      v-model="element.text"
                      type="textarea"></el-input>
          </div>
        </div>
        <div class="item">
          <div class="content">
            <el-checkbox v-model="element.fontWeight"
                         true-label="bold"
                         false-label="normal">加粗</el-checkbox>
          </div>
        </div>
        <div class="item">
          <div class="content">
            <el-button size="small"
                       type="primary"
                       @click="element.textAlign = 'left'">左对齐</el-button>
            <el-button size="small"
                       type="primary"
                       @click="element.textAlign = 'center'">居中</el-button>
            <el-button size="small"
                       type="primary"
                       @click="element.textAlign = 'right'">右对齐</el-button>
          </div>
        </div>
        <div class="item">
          <label>颜色</label>
          <div class="content">
            <el-input class="input"
                      type="color"
                      v-model="element.color"></el-input>
          </div>
        </div>
        <div class="item">
          <label>字体大小</label>
          <div class="content">
            <el-input-number v-model="element.fontSize"></el-input-number>
          </div>
        </div>
        <div class="item">
          <label>行高</label>
          <div class="content">
            <el-input-number v-model="element.lineHeight"></el-input-number>
          </div>
        </div>
        <div class="item">
          <label>字体</label>
          <div class="content">
            <!-- <el-input v-model="element.fontFamily"></el-input> -->
                      <el-select placeholder="请选择字体"
                     v-model="element.fontFamily"
                     clearable>
            <el-option v-for="item in fontFamily"
                       :label="item"
                       :value="item"></el-option>
          </el-select>
          </div>
        </div>
      </div>
      <!-- 通用控件-->

      <div class="item">
        <label>跳转链接</label>
        <div class="content">
          <el-input v-model="element.href"></el-input>
        </div>
      </div>
      <div class="item">
        <label>透明度</label>
        <div class="content">
          <el-slider v-model="element.opacity"></el-slider>
        </div>
      </div>
      <div class="item">
        <label>旋转</label>
        <div class="content">
          <el-slider v-model="element.transform"
                    :max="359"></el-slider>
        </div>
      </div>
      <div class="item"
           v-show="panelState !== 11">
        <label>高</label>
        <div class="content">
          <el-input v-model="element.height">
            <template slot="append">px</template>
          </el-input>
        </div>
      </div>
      <div class="item">
        <label>宽</label>
        <div class="content">
          <el-input v-model="element.width">
            <template slot="append">px</template>
          </el-input>
        </div>
      </div>
      <div class="item">
        <label>X轴坐标</label>
        <div class="content">
          <el-input v-model="element.left">
            <template slot="append">px</template>
          </el-input>
        </div>
      </div>
      <div class="item">
        <label>Y轴坐标</label>
        <div class="content">
          <el-input v-model="element.top">
            <template slot="append">px</template>
          </el-input>
        </div>
      </div>
    </div>
    <div v-if="panelTabState === 1">
      <div class="item">
        <label>动画库</label>
        <div class="content">
          <el-select placeholder="daneden/animate.css"
                     v-model="element.animatedName"
                     clearable>
            <el-option v-for="item in animateList"
                       :label="item"
                       :value="item"></el-option>
          </el-select>
        </div>
      </div>
      <div class="item">
        <label>是否循环</label>
        <div class="content">
          <el-checkbox v-model="element.loop">循环</el-checkbox>
        </div>
      </div>
      <div class="item">
        <label>速度</label>
        <div class="content">
          <el-slider v-model="element.duration"
                     :step="0.1"
                     :min="0"
                     :max="10"></el-slider>
        </div>
      </div>
      <div class="item">
        <label>延迟</label>
        <div class="content">
          <el-slider v-model="element.delay"
                     :step="0.1"
                     :min="0"
                     :max="10"></el-slider>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.panel-edit {
  z-index: 1;
  .item {
    padding: 5px 0;
    clear: both;
    .content {
      margin-left: 70px;
    }
  }
  label {
    text-align: right;
    vertical-align: middle;
    font-size: 14px;
    color: #48576a;
    line-height: 1;
    width: 70px;
    float: left;
    padding: 11px 12px 11px 0;
  }
}

.panel-tab {
  line-height: 40px;
  margin: -10px -10px 10px;
  .tab {
    float: left;
    width: 50%;
    text-align: center;
    cursor: pointer;
    background-color: #d6d6d6;
    &.active {
      background-color: transparent;
    }
  }
}
</style>

<script>
export default {
  props: {
    element: {
      type: Object
    },
    panelState: {
      type: Number
    }
  },
  data () {
    return {
      panelTabState: 0,
      animateList: ['bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble', 'jello', 'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp', 'bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp', 'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig', 'fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'fadeOutLeft', 'fadeOutLeftBig', 'fadeOutRight', 'fadeOutRightBig', 'fadeOutUp', 'fadeOutUpBig', 'flip', 'flipInX', 'flipInY', 'flipOutX', 'flipOutY', 'lightSpeedIn', 'lightSpeedOut', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft', 'rotateOutUpRight', 'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight', 'slideOutUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight', 'zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp', 'zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp', 'hinge', 'rollIn', 'rollOut'],
      fontFamily: ['宋体', '微软雅黑', '幼体', '黑体', 'sans-serif']
    }
  }
}
</script>
