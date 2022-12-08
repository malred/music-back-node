import db from "../db/db";
import { toUserInfo } from "../user/info";
import { column } from "./addFriend";
// 根据uid查询分组信息
export async function getGroupsByUid(uid, res) {
    try {
        return db.query(
            `select ${column}
            from music.friends
            where uid = '${uid}'`
        )
    } catch {
        return res.send({
            status: 500,
            msg: `获取分组失败`,
        });
    }
}
// 查询某人的某个分组的好友id
export async function getFidByGroupAndUid(group, uid, res) {
    try {
        return db.query(
            `select fid
            from music.friends
            where ${column} = '${group}'
              and uid = '${uid}'`
        )
    } catch {
        return res.send({
            status: 500,
            msg: `获取好友id失败`,
        });
    }
}
// 根据id获取信息
export async function getUserInfoById(fid, res) {
    try {
        return db.query(
            `select *
            from music.muser_info
            where id = '${fid}';`
        )
    } catch {
        return res.send({
            status: 500,
            msg: `获取好友信息失败`,
        });
    }
}
// 获取好友列表
export default async function getFriendsByUid(req, res) {
    if (!req || !req.query) {
        return res.send({
            status: 400,
            msg: "请求参数错误",
        });
    }
    const { uid } = req.query;
    try {
        // 用于返回的对象(Map<String, List<MuserInfo>>)
        let map = {}
        // 先查询该uid的所有分组 
        let groups = await getGroupsByUid(uid, res)
        if (groups[0] !== undefined) {
            // 该分组下所有朋友的info -> {group1: [userinfo1,...2,...3,group2: [...]}
            let muserInfos = []
            for (let i = 0; i < groups[0].length; i++) {
                // 遍历获取不同分组的friend
                let fids = await getFidByGroupAndUid(groups[0][i][0], uid, res)
                if (fids[0] !== undefined) {
                    for (let j = 0; j < fids[0].length; j++) {
                        let finfo = await getUserInfoById(fids[0][j][0], res)
                        // 查无此人就继续下一个
                        if (finfo[0] !== undefined && finfo[0].length > 0) {
                            // 封装为对象返回
                            let muserinfo = await toUserInfo(finfo)
                            // push在末端添加元素
                            muserInfos.push(muserinfo)
                        }
                    }
                }
                //最后组别为key,朋友list为value,放入map
                map[groups[0][i][0]] = muserInfos;
            }
        }
        return res.send({
            status: 200,
            data: map,
        });
    } catch {
        return res.send({
            status: 500,
            // msg: map,
            msg: '获取好友列表失败',
        });
    }
}
