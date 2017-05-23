/**
 * Created by zhengguorong on 2016/11/9.
 */


//设计图宽高比
var designwhScale = 320/508;
//现窗口宽高比
var curwhScale = window.innerWidth/window.innerHeight;

var resizes = document.querySelectorAll('.resize');

//外层容器定位
var swiperContainer = document.querySelector('.container');
var containerWidth = 320;
var containerHeight = 508;
var containerTop = 0;
var containerLeft = 0;
if (curwhScale < designwhScale) {
	containerWidth = window.innerWidth
	containerHeight = window.innerWidth / designwhScale
	containerTop = (window.innerHeight - containerHeight)/2
}else {
	containerWidth = window.innerHeight * designwhScale;
	containerHeight = window.innerHeight;
	containerLeft = (window.innerWidth - containerWidth)/2
}
swiperContainer.style.width = containerWidth;
swiperContainer.style.height = containerHeight;
swiperContainer.style.left = containerLeft;
swiperContainer.style.top = containerTop;

 //放大比例
var scale = containerWidth / 320 
//元素缩放
for (var j = 0; j < resizes.length; j++) {
	resizes[j].style.width = parseInt(resizes[j].style.width) * scale + 'px';
	resizes[j].style.height = parseInt(resizes[j].style.height) * scale + 'px';
	resizes[j].style.left = parseInt(resizes[j].style.left) * scale + 'px';
	resizes[j].style.top = parseInt(resizes[j].style.top) * scale + 'px';
	resizes[j].style.right = parseInt(resizes[j].style.right) * scale + 'px';
}

