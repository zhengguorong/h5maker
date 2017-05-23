var swiper = new Swiper('.swiper-container', {
  direction: 'vertical',
  mousewheelControl: true,
  nextButton:'.button-next',
  onInit: function (swiper) {
    swiperAnimate(swiper);
  },
  onSlideChangeEnd: function (swiper) {
    swiperAnimate(swiper);
  },
})

var loader = (function () {
  var loadingContainer = document.getElementById('loadingCont')
  var loadingTxt = document.getElementById('loadingTxt')
  var loadingCircle = document.getElementById('loadingCircle')
  var loadingCircleP = loadingCircle.getAttribute('stroke-dasharray')
  var imgs = document.getElementsByTagName('img')
  var srcList = []
  var imgList = []
  var imgSrc, i
  for (i = 0; i < imgs.length; i++) {
    imgSrc = imgs[i].getAttribute('pre-src')
    if (imgSrc) {
      srcList.push(imgSrc)
      imgList.push(imgs[i])
    }
  }
  if (srcList.length === 0) {
      swiper.container[0].style.opacity = 1
      loadingContainer.style.opacity = 0
      swiperAnimate(swiper)
  }
  return new resLoader({
    resources: srcList,
    onStart: function (total) {
      console.log('start:' + total)
    },
    onProgress: function (current, total) {
      console.log(current + '/' + total)
      var p = current / total
      loadingTxt.textContent = Math.round(p * 100) + '%'
      loadingCircle.style.strokeDashoffset = (1 - p) * loadingCircleP
    },
    onComplete: function (total) {
      console.log('加载完毕:' + total + '个资源')
      for (i = 0; i < imgList.length; i++) {
        imgList[i].setAttribute('src', srcList[i])
      }
      swiper.container[0].style.opacity = 1
      loadingContainer.style.opacity = 0
      swiperAnimate(swiper)
    }
  })
})()
loader.start()
