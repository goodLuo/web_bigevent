$(function () {
    // 鼠标经过头部的个人中心，快捷菜单的显示和隐藏
    $('.personal').on('mouseenter', function () {
        $(this).find('a').css('color', "#fff")

        $('.quick').stop().slideDown()
    })
    $('.personal').on('mouseleave', function () {
        $(this).find('a').css('color', "rgba(255, 255, 255, .7)")
        $('.quick').stop().slideUp()
    })

    // 点击功能导航一级标题，让其对应的二级标题显示出来
    $('.side-title').on('click', function () {
        $(this).siblings('.side-arial').stop().slideToggle()
        // 只允许一个二级标题显示出来
        if ($(this).parents(".funNav").siblings('.funNav').find('.side-arial').css('display') == 'block') {
            $(this).parents(".funNav").siblings('.funNav').find('.side-arial').stop().slideUp()
        }
    })
    // 点击首页，隐藏所有的二级标题
    $('.side-title').eq(0).on('click', function () {
        $('.side-arial').slideUp()
    })
    // 点击当前更改当前点击的标题样式
    $('.cArea').on('click', function () {
        $('.cArea').removeClass('current')
        $(this).addClass('current')
    })

    // 调用 getUserInfo() 函数获取用户基本信息
    getUserInfo()


    // 实现退出功能
    $('.exitBut').on('click', function () {
        // 跳转到登陆页面并删除存在浏览器的 token 属性
        location.href = './login.html'
        localStorage.removeItem('token')
    })

})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        type: 'GET',
        // 不写跟路径必须先导入 baseAPI.js ajax预处理文件
        url: '/my/userinfo',
        // 需携带一个headers请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ""
        // },
        success: function (res) {
            // console.log(res);
            // res.status !== 0 说明获取用户基本信息失败
            if (res.status !== 0) {
                return false
            }
            // 按择渲染用户 图片头像或文字头像
            renderAvatar(res.data)
        },
        /*
        // 无论成功还是失败都会调用此函数
        complete:function(res){
            // console.log(res);
            // res.responseJSON能获取到服务器返回结果
            if (res.responseJSON.status == 1) {
                // 强制清空 token 
                localStorage.removeItem('token')
                // 强制跳转至登陆页面
                location.href = './login.html'
            }
        }
        */
    })
}
// 渲染用户头像函数
function renderAvatar(userInfo) {
    // 1、获取用户的名称 应优先使用用户设置的昵称 nickname 如果没有设置则使用用户登陆昵称 username
    let name = userInfo.nickname || userInfo.username

    // 2、设置主页问候语
    $('.Uname').html(name)
    $('.welcome').html(`欢迎  ${name}`)

    // 3、按择渲染头像-
    if (userInfo.user_pic) {
        $('.photo').css('src', userInfo.user_pic).show()
        $('.text-photo').hide()
    } else {
        $('.photo').hide()
        let first = name[0].toUpperCase()
        $('.text-photo').html(first)
    }


}