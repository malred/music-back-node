import db from "../../db/db";
import {getMuserIdByUname} from "../user/info";
// 如果直接在语句用group会报错(因为是关键词)
// 但是在``里又不能加``来区别关键字
// 所有用变量来规避关键字
export var column = '`group`'
// 根据uid和fid查询分组信息
export async function getByUidAndFid(uid, fid, res) {
    try {
        // 查询旧分组
        return db.query(
            `select ${column}
            from music.friends
            where uid = '${uid}'
              and fid = '${fid}'`
        )
    } catch {
        return res.send({
            status: 500,
            msg: `获取分组失败`,
        });
    }
}
// 根据uid和fid改分组
export async function updataGroupByUidAndFid(uid, fid, fgroup, res) {
    try {
        // 更新分组 
        db.query(
            `update music.friends
            set ${column} = '${fgroup}'
            where uid = '${uid}'
              and fid = '${fid}'`
        )
    } catch {
        return res.send({
            status: 500,
            msg: `更新分组失败`,
        });
    }
}
// 用于新添加的好友是否已存在(分组也没变)
export async function getByUidAndFidAndGroup(uid, fid, fgroup, res) {
    try {
        return db.query(
            `select *
            from music.friends
            where uid = '${uid}'
              and fid = '${fid}'
              and ${column} = '${fgroup}'`
        )
    } catch {
        return res.send({
            status: 500,
            msg: `查询好友信息失败`,
        });
    }
}
// 添加好友
export default async function addFriend(req, res) {
    if (!req || !req.body) {
        return res.send({
            status: 400,
            msg: "请求参数错误",
        });
    }
    const { uid, fname, fgroup } = req.body;
    try {
        //通过fname获取id
        var fid = await getMuserIdByUname(fname)
        if (fid[0] === undefined) {
            res.send({
                status: 500,
                msg: "查无此人",
            });
            return res.end()
        }
        // 如果已存在该好友,但是分组不同,就改分组
        let ogroup = await getByUidAndFid(uid, fid, res)
        // ogroup[0] !== undefined ?
        //     ogroup = ogroup[0][0][0] : ogroup = ''
        if (ogroup[0] != undefined) {
            for (let i = 0; i < ogroup[0].length; i++) {
                if (ogroup[0][i][0] !== fgroup) {
                    // 改分组
                    await updataGroupByUidAndFid(uid, fid, fgroup, res)
                    res.send({
                        status: 200,
                        data: "修改分组成功",
                    });
                    return res.end()
                }
            }
        }
        // if (ogroup !== fgroup &&
        //     // 一条都没有的时候返回为null也会满足前面的判断 
        //     '' !== ogroup
        // ) {
        // // 改分组
        // await updataGroupByUidAndFid(uid, fid, fgroup, res)
        // return res.send({
        //     status: 200,
        //     data: "修改分组成功",
        // });
        // } else {
        //如果已存在,分组也相同
        if (await getByUidAndFidAndGroup(uid, fid, fgroup, res).length > 0) {
            res.send({
                status: 500,
                msg: `你已添加过该好友`,
            });
            return res.end()
        }
        // 正向好友 -> 添加者 to 被添加者
        await db.query(
            `insert into friends (uid, fid, ${column} )
                 values ('${uid}', '${fid}', '${fgroup}')`
        );
        // 反向好友 -> 被添加者 to 添加者
        // 如果对方已经有添加者的好友(即添加者是修改分组),就返回
        // let group = await getByUidAndFid(fid, uid, res)
        // if (group[0] != undefined) {
        //     return res.send({
        //         status: 200,
        //         data: "修改分组成功",
        //     });
        // }
        await db.query(
            `insert into friends (uid, fid, ${column} )
                     values ('${fid}', '${uid}', '默认')`
        );
        res.send({
            status: 200,
            data: "添加好友成功",
        });
        return res.end()
    }
    // }
    catch {
        res.send({
            status: 500,
            msg: `添加好友失败`, // ${uid},${fid},${fgroup}
            // 调试返回group by uid,fid 时使用:
            // msg: [0:[], 1:[...]] 下标1的数据是默认返回的,就算下标0的数据为空 
            // msg: group,
            // msg: group !== fgroup && '' !== group 
            // msg: group[0] 
        });
        return res.end()
    }
}
