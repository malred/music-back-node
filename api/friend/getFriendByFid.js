import { toUserInfo } from "../user/info";
import { getUserInfoById } from "./getFriends";
// 根据id获取好友信息
export default async function getFriendByFid(req, res) {
    if (!req || !req.query) {
        return res.send({
            status: 400,
            msg: "请求参数错误",
        });
    }
    const { fid } = req.query;
    try {
        let finfo = await getUserInfoById(fid, res)
        if (finfo[0] !== undefined) {
            return res.send({
                status: 200,
                data: await toUserInfo(finfo)
            });
        } else {
            return res.send({
                status: 500,
                msg: '获取好友信息失败',
            });
        }
    } catch {
        return res.send({
            status: 500,
            msg: '获取好友信息失败',
        });
    }
}
