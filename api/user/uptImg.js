var multiparty = require('multiparty');
var fs = require('fs')
// 更新头像,但是没有合适的图床,不做使用
export default async function uptImg(req, res) {
    // 没设置就默认保存到->C:\Users\13695\AppData\Local\Temp\
    var form = new multiparty.Form({ 'uploadDir': "D:\\vs-vue\\vuelearnv7\\music-back-node\\api\\static" });
    // fields是文本数据,files是文件数据
    form.parse(req, function (err, fields, files) {
        return res.status(200).send({
            data: files
        })
    });
}