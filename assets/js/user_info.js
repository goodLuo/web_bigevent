$(function () {
    // 调用 initUserInfo() 初始化用户基本信息函数
    initUserInfo()

    // 点击重置按钮
    $('.resetBut').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })


    // 点击提交修改按钮
    $('.subBtn').on('click', function (e) {
        e.preventDefault()
        // 用户昵称验证规则
        let nickname = $.trim($('.nickname').val()).length
        if (nickname <= 0 || nickname > 6) {
            return hintwin($('.hint'), '昵称长度必须在1~6个字符之间', $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
        }

        // 电子邮箱验证规则
        let emailReg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/ 
        let email = $.trim($('.email').val())
        if (!emailReg.test(email)) {
            return hintwin($('.hint'), '请输入正确的邮箱', $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
        }

        // 当格式都正确时
        let dataObj = {
            id: $('.userId').val(),
            nickname: $('.nickname').val(),
            email: $('.email').val()
        }
        console.log(dataObj);
        updateUserInfo(dataObj)
        // 调用页面的 getUserInfo() 函数获取并渲染用户基本信息
        window.parent.getUserInfo()
        
    })


    // 更新用户信息函数 updateUserInfo()
    function updateUserInfo(data) {
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: data,
            success: function (res) {
                if (res.status !== 0) return hintwin($('.hint'), '修改用户信息失败', $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
                hintwin($('.hint'), '修改信息成功', $('.hint-msg'), "rgb(128, 255, 0)", '&#xe638;', $('.hint-icon'),false)
            }
        })
    }


    // 初始化用户的基本信息函数 initUserInfo()
    function initUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) return hintwin($('.hint'), '获取用户信息失败！请重新登录', $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
                $('.login-name').val(res.data.username)
                $('.nickname').val(res.data.nickname || res.data.username)
                $('.email').val(res.data.email)
                $('.userId').val(res.data.id)
            }
        })
    }

})