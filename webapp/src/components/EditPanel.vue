<template>
  <div class="panel panel-edit">
    <div class="panel-tab clearfix">
      <div class="tab"
           :class="{ active: panelTabState === 0 }"
           @click="function () { panelTabState = 0 }">
        <span v-if="panelState === 11">文本</span>
        <span v-if="panelState === 12">元素</span>
      </div>
      <div class="tab"
           :class="{ active: panelTabState === 1 }"
           @click="function () { panelTabState = 1 }">动作</div>
    </div>
    <el-form label-width="5em">
      <div v-if="panelTabState === 0">
        <!-- 文字编辑界面特有控件 -->
        <template v-if="panelState === 11">
          <el-form-item label="跳转链接">
            <el-input v-model="element.href"></el-input>
          </el-form-item>
          <el-form-item label="文本内容">
            <el-input v-model="element.text"
                      type="textarea"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="element.fontWeight"
                         true-label="bold"
                         false-label="normal">加粗</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button size="small"
                       type="primary"
                       @click="element.textAlign = 'left'">左对齐</el-button>
            <el-button size="small"
                       type="primary"
                       @click="element.textAlign = 'center'">居中</el-button>
            <el-button size="small"
                       type="primary"
                       @click="element.textAlign = 'right'">右对齐</el-button>
          </el-form-item>
          <el-form-item label="颜色">
            <el-input type="color"
                      v-model="element.color"></el-input>
          </el-form-item>
          <el-form-item label="字体大小">
            <el-input-number v-model="element.fontSize"></el-input-number>
          </el-form-item>
          <el-form-item label="行高">
            <el-input-number v-model="element.lineHeight"></el-input-number>
          </el-form-item>
          <el-form-item label="字体">
            <el-input v-model="element.fontFamily"></el-input>
          </el-form-item>
        </template>
        <!-- 通用控件-->
        <el-form-item label="透明度">
          <el-slider v-model="element.opacity"></el-slider>
        </el-form-item>
        <el-form-item label="旋转">
          <el-slider v-model="element.transform"
                     :max="359"></el-slider>
        </el-form-item>
        <el-form-item label="高"
                      v-if="panelState !== 11">
          <el-input v-model="element.height">
            <template slot="append">px</template>
          </el-input>
        </el-form-item>
        <el-form-item label="宽">
          <el-input v-model="element.width">
            <template slot="append">px</template>
          </el-input>
        </el-form-item>
        <el-form-item label="X轴坐标">
          <el-input v-model="element.left">
            <template slot="append">px</template>
          </el-input>
        </el-form-item>
        <el-form-item label="Y轴坐标">
          <el-input v-model="element.top">
            <template slot="append">px</template>
          </el-input>
        </el-form-item>
      </div>
      <div v-if="panelTabState === 1">
        <el-form-item label="动画库">
          <el-select placeholder="daneden/animate.css"
                     v-model="element.animatedName"
                     clearable>
            <el-option v-for="item in animateList"
                       :label="item"
                       :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否循环">
          <el-checkbox v-model="element.loop"></el-checkbox>
        </el-form-item>
        <el-form-item label="速度">
          <el-slider v-model="element.duration"
                     :step="0.1"
                     :min="0"
                     :max="10"></el-slider>
        </el-form-item>
        <el-form-item label="延迟">
          <el-slider v-model="element.delay"
                     :step="0.1"
                     :min="0"
                     :max="10"></el-slider>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<style lang="less" scoped>
.panel-edit {
  z-index: 1;
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
      animateList: ['bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble', 'jello', 'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp', 'bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp', 'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig', 'fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'fadeOutLeft', 'fadeOutLeftBig', 'fadeOutRight', 'fadeOutRightBig', 'fadeOutUp', 'fadeOutUpBig', 'flip', 'flipInX', 'flipInY', 'flipOutX', 'flipOutY', 'lightSpeedIn', 'lightSpeedOut', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft', 'rotateOutUpRight', 'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight', 'slideOutUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight', 'zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp', 'zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp', 'hinge', 'rollIn', 'rollOut']
    }
  }
}
</script>
