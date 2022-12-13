/** 返回结果类 */
/** 正常返回 */
export function OK(data, res) {
    return res.send({ status: 200, data })
}
/** 错误返回 */
export function ERR(msg, res) {
    return res.send({ status: 500, msg })
}
export default {
    OK, ERR
}

