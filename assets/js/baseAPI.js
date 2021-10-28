$(function () {
    // 每次使用jQuery发起ajax时，都会先调用 $.ajaxPrefilter()  方法，方法中接收一个函数作为参数，函数中有一个参数 option 能获取到当前发送的ajax请求的配置对象
    $.ajaxPrefilter(function (option) {
        // console.log(option.url);
        // 然后再真正发起ajax请求时，会使用这里配置过的配置项
        option.url = "http://api-breakingnews-web.itheima.net" + option.url

        // 设置配置的请求头--但只需需要权限的url地址才需要设置
        if (option.url.includes('/my/')) {
            option.headers = {
                Authorization: localStorage.getItem('token') || ""
            }
        }

        // 设置ajax的complete函数--无论请求成功还是失败都会调用complete函数，当请求失败时，强制页面跳转至登陆页面
        option.complete = function(res){
            if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
                // 强制清空 token 
                localStorage.removeItem('token')
                // 强制跳转至登陆页面
                location.href = './login.html'
            }
        }


    })
})