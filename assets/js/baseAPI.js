$(function () {
    // 每次使用jQuery发起ajax时，都会先调用 $.ajaxPrefilter()  方法，方法中接收一个函数作为参数，函数中有一个参数 option 能获取到当前发送的ajax请求的配置对象
    $.ajaxPrefilter(function (option) {
        // 然后再真正发起ajax请求时，会使用这里配置过的配置项
        option.url = "http://api-breakingnews-web.itheima.net" + option.url
        console.log(option.url);
    })
})