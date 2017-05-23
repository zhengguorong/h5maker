(function () {
  var designW = 320
  var designH = 508
  var designR = designW / designH

  var actualW = document.documentElement.clientWidth
  var actualH = document.documentElement.clientHeight
  var actualR = actualW / actualH

  var scale = (actualR > designR) ? (actualH / designH) : (actualW / designW)
  var style = 'width: ' + designW + 'px; height: ' + designH + 'px; -webkit-transform: scale(' + scale + '); transform: scale(' + scale + '); '
  if (actualW < designW) {
    if (actualR > designR) {
      style += 'margin-left: ' + (actualW - designW) / 2 + 'px;'
    } else {
      style += '-webkit-transform-origin: left; transform-origin: left;'
    }
  }

  var containers = document.getElementsByClassName('resize-container')
  var i
  for (i = 0; i < containers.length; i++) {
    containers[i].setAttribute('style', style)
  }
})()
