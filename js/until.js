// 共用函数
let Until = {
    /**
     * 创建dom
     * @param {Node} domName 创建目标dom名称，必须
     * @param  {...any} rest dom要绑定的属，可选；dom下文本内容，可选
     */
    createDom(domName, ...rest) {
        if (typeof domName === 'string' && domName.length !== 0) {
            let dom = document.createElement(domName)
            // 提供dom属性对象时，添加dom属性
            if (rest[0] instanceof Object) {
                for (let key in rest[0]) {
                    dom.setAttribute(key, rest[0][key])
                }
                // 判断是否提供文本，有则添加文本
                let text = typeof rest[1] === 'undefined' ? document.createTextNode('') : document.createTextNode(rest[1])
                dom.appendChild(text)
            } else {
                // 没有提供属性对象，判断是否提供文本，提供直接添加文本
                let text = typeof rest[0] === 'string' ? rest[0] : ""
                let textDom = document.createTextNode(text)
                dom.appendChild(textDom)
            }
            return dom
        } else {
            console.warn('domname类型错误/或未提供')
            return false
        }
    },
    /**
     * 设置dom样式
     * @param {NodeObject} target 必须
     * @param {obj} styles 必须
     */
    setStyle(target, styles) {
        if (typeof target !== 'object') {
            console.log('请提供正确的dom')
        } else {
            for (let key in styles) {
                target['style'][key] = styles[key]
            }
        }
    },
    /**
    * 修改dom 的属性，支持同时修改多个
    * @param {Node} dom 目标dom
    * @param {object} obj 要修改的属性
    */
    changeAttr(dom, obj) {
        for (let key in obj) {
            dom[key] = obj[key]
        }
    },
}