var path = require('path'); // 文件绝对路径处理
var fs = require('fs'); // 文件处理
// 获取图片 
export default function getImg(req, res) {
    try {
        if (!req || !req.query) {
            return res.send({
                status: 400,
                msg: "请求参数错误",
            });
        }
        const { name } = req.query
        // "D:\\vs-vue\\vuelearnv7\\music-back-node\\api\\static\\bs.jpg"
        var filePathname = __dirname + '\\' + name
        fs.readFileSync(filePathname, "binary", (err, data) => {
            // 如果有问题返回 404
            if (err) {
                return res.send({ status: 404, msg: "找不到该文件" });
                // 没问题返回文件内容
            } else {
                // 设置好响应头
                res.writeHead({ "Content-Type": 'image/jpeg' });
                return res.send(data, 'binary')
            }
        }) 
    } catch {
        return res.send({
            status: 500,
            msg: `获取头像失败`,
        });
    }
}