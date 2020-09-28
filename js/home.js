// dom对象
let Dom = {
    yearlist: document.querySelector('#yearlist'),
    monlist: document.querySelector('#monlist'),
    yearBtn: document.querySelector('#yearBtn'),
    monBtn: document.querySelector('#monBtn'),
    yearDown: document.querySelector('#yearDown'),
    monDown: document.querySelector('#monDown'),
    year: document.querySelector('#year'),
    month: document.querySelector('#month'),
    card: document.querySelector('#card'),
    today: document.querySelector('#today'),
}
// 业务逻辑
let Service = {
    // 选择列表状态
    monlistStatus: false,
    yearlistStatus: false,
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    week: [0, 1, 2, 3, 4, 5, 6],
    currentYear: "",
    currentMonth: "",
    /**
     * 初始化下拉菜单
     * @param {number} startY 左边界，必须
     * @param {number} endY 右边界，必须
     */
    initSelectYear(startY, endY) {
        for (let i = startY; i <= endY; i++) {
            let li = Until.createDom('li', { 'value': i }, i)
            if (li !== false) {
                Dom.yearlist.appendChild(li)
            }
        }
    },
    // 初始化月份选择列表
    initSelectMon() {
        this.month.forEach((e, index) => {
            let li = Until.createDom('li', { 'value': index }, e)
            if (li !== false) {
                Dom.monlist.appendChild(li)
            }
        })
    },
    /**
     * 切换dom显示/隐藏
     * @param {domObj} domObj 目标dom
     * @param {string} target 控制目标dom状态的变量
     */
    toggle(domObj, target) {
        if (this[target] === false) {
            Until.setStyle(domObj, {
                'visibility': 'visible'
            })
            this[target] = true
        } else {
            Until.setStyle(domObj, {
                'visibility': 'hidden'
            })
            this[target] = false
        }
        return this[target]
    },
    renderData(dom, value) {
        if (value !== undefined && value > 100) {
            dom.innerText = value
        } else if (value < 100) {
            dom.innerText = this.month[value]
        } else {
            alert('请选择正确的年份/月份')
        }
        this.initHint()
    },
    /**
     * 根据是否选中年份/月份来决定是否显示提示内容
     */
    initHint() {
        // 显示提示内容
        if (this.currentMonth.length === 0 || this.currentYear.length === 0) {
            Until.setStyle(document.querySelector('#hint'), {
                'display': "block"
            })
            Until.setStyle(Dom.card, {
                'display': "none",
            })
        } else {
            // 显示具体日历
            Until.setStyle(document.querySelector('#hint'), {
                'display': "none"
            })
            Until.setStyle(Dom.card, {
                'display': "flex",
            })
            // 卸载上一次的dom
            Dom.card.innerText = ''
            // 渲染dom
            this.initCard()
        }
    },
    // 判断是否是闰年
    isLeapYear() {
        // 普通闰年：能被4整除而不能被100整除
        // 世纪闰年：能被100和400整除
        if ((this.currentYear / 4 == Math.floor(this.currentYear / 4) && this.currentYear / 100 != Math.floor(this.currentYear / 100)) || (this.currentYear / 400 == Math.floor(this.currentYear / 400) && this.currentYear / 3200 != Math.floor(this.currentYear / 3200)) || this.currentYear / 172800 == Math.floor(this.currentYear / 172800)) {
            return true
        }
        return false
    },
    /**
     * 
     * 判断该月有多少天
     * @param {number} month 
     */
    getDays() {
        let days = 0
        let month = this.month.indexOf(this.currentMonth)
        switch (month + 1) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                days = 31
                break
            case 4:
            case 6:
            case 9:
            case 11:
                days = 30
                break
            case 2:
                days = this.isLeapYear() === true ? 29 : 28
                break;
            default:
                break;
        }
        return days
    },
    // 渲染表格
    initCard() {
        let year = this.currentYear
        let month = this.month.indexOf(this.currentMonth)
        // 创建选择日期对象
        let date = new Date(year, month, 1)
        // 获取选择日期的第一天是星期几
        let week = this.week.indexOf(date.getDay())
        // 根据是星期几来决定渲染多少行数据
        let rowCount = week === 5 || week === 6 ? 6 : 5
        // 外层循环行
        for (let row = 0; row < rowCount; row++) {
            let ul = Until.createDom('ul')
            // 内层循环列
            for (let col = 0; col < 7; col++) {
                let li = null
                let span = null
                // 判断工作日还是休息日，添加不同的样式
                if (col === 0 || col === 6) {
                    span = Until.createDom('span', '休息日')
                    li = Until.createDom('li', { 'class': 'rest' })
                } else {
                    span = Until.createDom('span', '工作日')
                    li = Until.createDom('li')
                }
                li.appendChild(span)
                ul.appendChild(li)
            }
            Dom.card.appendChild(ul)
        }
        // 隐藏非本月的卡片
        let lis = document.querySelectorAll('.card li')
        let day = 1
        for (let key in [...lis]) {
            if (key < week || key > this.getDays() + week - 1) {
                Until.changeAttr(lis[key], { 'className': "rest other" })
            } else {
                let text = Until.createDom('div', `${month + 1}-${day++}`)
                lis[key].appendChild(text)
            }
            // 添加其他文本
            if (![...lis[key].classList].includes('rest')) {
                lis[key].appendChild(Until.createDom('div', '辛苦了'))
            }
        }
    },
    initToday() {
        let date = new Date()
        let today = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        Dom.today.innerText = today
    },
    // 入口
    /**
     * 
     * @param {function} callback 提供启动初始化函数
     */
    init(callback) {
        callback()
    }
}

// 项目初始化
Service.init(
    () => {
        // 初始化年份选择列表
        Service.initSelectYear(2000, 2020)
        // 初始化月份选择列表
        Service.initSelectMon()
        // 初始化提示内容
        Service.initHint()
        // 初始化今天日期
        Service.initToday()
    }
)
// 点击切换月份列表状态
Dom.monBtn.addEventListener('click', () => {
    // 改变月列表显示状态
    let status = Service.toggle(Dom.monlist, 'monlistStatus')
    // 修改选择按钮的箭头样式
    if (status) {
        Until.changeAttr(Dom.monDown, {
            'className': 'iconfont icon-upward'
        })
    } else {
        Until.changeAttr(Dom.monDown, {
            'className': 'iconfont icon-down'
        })
    }
})
// 点击切换年份列表状态
Dom.yearBtn.addEventListener('click', () => {
    // 改变年列表显示状态
    let status = Service.toggle(Dom.yearlist, 'yearlistStatus')
    // 修改选择按钮的箭头样式
    if (status) {
        Until.changeAttr(Dom.yearDown, {
            'className': 'iconfont icon-upward'
        })
    } else {
        Until.changeAttr(Dom.yearDown, {
            'className': 'iconfont icon-down'
        })
    }
})
// 鼠标移出列表时隐藏
Dom.monlist.addEventListener('mouseleave', (e) => {
    // 隐藏列表
    Until.setStyle(e.target, {
        'visibility': 'hidden'
    })
    Service.monlistStatus = false
    // 修改选择按钮的箭头样式
    Until.changeAttr(Dom.monDown, {
        'className': 'iconfont icon-down'
    })
})
// 鼠标移出列表时隐藏
Dom.yearlist.addEventListener('mouseleave', (e) => {
    // 隐藏列表
    Until.setStyle(e.target, {
        'visibility': 'hidden'
    })
    Service.yearlistStatus = false
    // 修改选择按钮的箭头样式
    Until.changeAttr(Dom.yearDown, {
        'className': 'iconfont icon-down'
    })
})
// 选中年份
Dom.yearlist.addEventListener('click', (e) => {
    // 保存选中的年份
    Service.currentYear = String(e.target.value)
    // 渲染年份
    Service.renderData(Dom.year, e.target.value)
    // 关闭选择面板
    Service.toggle(Dom.yearlist, 'yearlistStatus')
})
// 选中月份
Dom.monlist.addEventListener('click', (e) => {
    // 保存选中的月份
    Service.currentMonth = Service.month[e.target.value]
    // 渲染月份
    Service.renderData(Dom.month, e.target.value)
    // 关闭选择面板
    Service.toggle(Dom.monlist, 'monlistStatus')
})



