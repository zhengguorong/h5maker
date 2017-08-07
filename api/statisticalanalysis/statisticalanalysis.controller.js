/**
 * Created by Wesdint on 2017/7/14.
 */
var Answer = require('../submit/submit.model')
var Form = require('../form/form.model')
var async = require('async')
const fs = require('fs')
const xlsx = require('better-xlsx') // github: https://github.com/d-band/better-xlsx
module.exports.findAnswerById = (req, res) => {
  let formId = req.body.formId
  let pageIndex = req.body.pageIndex
  let pageSize = req.body.pageSize

  async.parallel({
    count: (done) => {
      Answer.count({formId: formId}).exec((err, count) => {
        done(err, count)
      })
    },
    records: (done) => {
      Answer.find({formId: formId}).sort({createDate: -1}).skip(pageSize * (pageIndex-1)).limit(pageSize).exec((err, doc) => {
        done(err, doc)
      })
    }
  }, (err, result) => {
    res.json(result)
  })
}

// 将答卷生成excel导出
module.exports.downloadExcel = (req, res) => {
  Form.find({_id: req.params.id}).exec().then((questionData) => Answer.find({formId: req.params.id}).exec()
      .then((answerData) => {
        let excelHeader = ['序号', '提交时间', '答题时长', '所在地IP', '来源渠道']
        let excelContent = []
        questionData[0].questions.forEach((item, index) => {
          if (item.qsType === 'radio') {
            excelHeader.push(++index + '.' + item.title + '【单选题】')
          } else if (item.qsType === 'check') {
            excelHeader.push(++index + '.' + item.title + '【多选题】')
          } else if (item.qsType === 'text') {
            excelHeader.push(++index + '.' + item.title + '【填空题】')
          } else if (item.qsType === 'file') {
            excelHeader.push(++index + '.' + item.title + '【文件上传】')
          }
        })
        answerData.forEach((item, index) => {
          let itemArr = []
          itemArr.push(index+1)
          itemArr.push(new Date(item.createDate).toLocaleString().replace(/:\d{1,2}$/,' '))
          itemArr.push(item.timeStamp)
          itemArr.push(item.ip)
          itemArr.push(item.sourcePlatform)
          item.result.forEach((inItem, inIndex) => {
            let qsType = questionData[0].questions[inIndex].qsType
            let validate = questionData[0].questions[inIndex].validate
            if (qsType === 'text' && validate === 'date') {
              let dateStr = ''
              inItem.ask.forEach((dateItem) => {
                dateStr = dateStr + '-' + dateItem
              })
              itemArr.push(dateStr.replace('-', ''))
            } else if (qsType === 'check') {
              let checkboxStr = ''
              inItem.ask.forEach((checkboxItem) => {
                checkboxStr = checkboxStr + ' | ' + checkboxItem
              })
              itemArr.push((checkboxStr))
            } else if (qsType === 'file' && validate === 'img') {
              let imgStr = ''
              inItem.ask.forEach((imgItem) => {
                imgStr = imgStr + 'http://' + req.headers.host + imgItem
              })
              itemArr.push(imgStr)
            } else if (qsType === 'file' && validate === 'pureFile') {
              let fileStr = ''
              inItem.ask.forEach((fileItem) => {
                fileStr = fileStr + 'http://' + req.headers.host + fileItem.path
              })
              itemArr.push(fileStr)
            } else {
              itemArr.push(inItem.ask)
            }
          })
          excelContent.push(itemArr)
        })
        // ----------//
        const file = new xlsx.File();
        const sheet = file.addSheet('Sheet1');
        const data = excelContent
        function border(cell, top, left, bottom, right) {
          const light = 'ffded9d4';
          const dark = 'ff7e6a54';
          cell.style.border.top = 'thin';
          cell.style.border.topColor = top ? dark : light;
          cell.style.border.left = 'thin';
          cell.style.border.leftColor = left ? dark : light;
          cell.style.border.bottom = 'thin';
          cell.style.border.bottomColor = bottom ? dark : light;
          cell.style.border.right = 'thin';
          cell.style.border.rightColor = right ? dark : light;
        }

        function fill(cell, type) {
          type = type || 0;
          const colors = ['ffffffff', 'ffa2917d', 'ffe4e2de', 'fffff8df', 'fff1eeec'];
          // 1: header, 2: first col, 3: second col, 4: gray, 0: white
          cell.style.fill.patternType = 'solid';
          cell.style.fill.fgColor = colors[type];
          cell.style.fill.bgColor = 'ffffffff';
        }
        const header = sheet.addRow();
        header.setHeightCM(0.8);
        const headers = excelHeader
        for (let i = 0; i <  headers.length; i++) {
          sheet.col(i).width = 30;
        }
        for (let i = 0; i < headers.length; i++) {
          const hc = header.addCell();
          hc.value = headers[i];
          hc.style.align.v = 'center';
          if (i > 0) hc.style.align.h = 'center';
          hc.style.font.color = 'ffffffff';
          border(hc, 0, 0, 1, 0);
          fill(hc, 1);
        }

        const len = data.length;
        for (let i = 0; i < len; i++) {
          const line = data[i];
          const row = sheet.addRow();
          row.setHeightCM(0.8);
          // Col 1
          const lineLen = line.length
          for (let p = 0; p <lineLen; p++) {
            let cell = row.addCell()
            cell.value = line[p]
            cell.style.align.v = 'center'
          }
          // cell1.style.align.v = 'center';
          // if (i === 0) {
          //   border(cell1, 1, 0, 0, 1);
          // } else if (i === len - 1) {
          //   border(cell1, 0, 0, 1, 1);
          // } else {
          //   border(cell1, 0, 0, 0, 1);
          // }
          // fill(cell1, 2);
          // // Col 2
          // const cell2 = row.addCell();
          // cell2.value = line[1];
          // cell2.numFmt = '$#,##0.00';
          // cell2.cellType = 'TypeNumeric';
          // cell2.style.align.v = 'center';
          // if (i === 0) {
          //   border(cell2, 1, 1, 0, 0);
          // } else if (i === len - 1) {
          //   border(cell2, 0, 1, 1, 0);
          // } else {
          //   border(cell2, 0, 1, 0, 0);
          // }
          // fill(cell2, 3);
          // // Col 3
          // const cell3 = row.addCell();
          // cell3.value = line[2];
          // cell3.numFmt = '$#,##0.00';
          // cell3.cellType = 'TypeNumeric';
          // cell3.style.align.v = 'center';
          // if (i === 0) {
          //   border(cell3, 1, 0, 0, 0);
          // } else if (i === len - 1) {
          //   border(cell3, 0, 0, 1, 0);
          // } else {
          //   border(cell3, 0, 0, 0, 0);
          // }
          // fill(cell3, i % 2 === 0 ? 0 : 4);
          // // Col 4
          // const cell4 = row.addCell();
          // cell4.formula = line[3];
          // cell4.numFmt = '$#,##0.00';
          // cell4.cellType = 'TypeFormula';
          // cell4.style.align.v = 'center';
          // if (i === 0) {
          //   border(cell4, 1, 0, 0, 0);
          // } else if (i === len - 1) {
          //   border(cell4, 0, 0, 1, 0);
          // } else {
          //   border(cell4, 0, 0, 0, 0);
          // }
          // fill(cell4, i % 2 === 0 ? 0 : 4);
        }
        // for (let i = 0; i < 4; i++) {
        //   sheet.col(i).width = 20;
        // }
        res.setHeader(
            "Content-Disposition", "attachment;filename=answer.xlsx"
        );
        file
            .saveAs()
            .on('data', (chunk) => {res.write(chunk, 'binary')})
            .on('end', () => {res.end()})
      }))
}

// 生成报表数组
module.exports.generateReport = (req, res) => {
var questionInfoList = []
     Form.find({_id: req.body.formId}).then((formResult)=> {
       questionInfoList = formResult[0][questions]

     })
}