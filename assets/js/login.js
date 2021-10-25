$(function () {
    // 点击“去注册账号”
    $('#link_reg').on('click', function () {
        $('.loginBox').hide().siblings('.regBox').show()
    })

    // 点击“已有账号去登录”
    $('#link-login').on('click', function () {
        $('.regBox').hide().siblings('.loginBox').show()
    })

    // 登录模块
    $('.loginInput').on('submit', function (e) {
        e.preventDefault()
        // 点击登录按钮时，先判断用户名是否有填写
        if (!$.trim($('#username').val()) || !$.trim($('#password').val())) {
            return alertError("必填项不能为空")
        }
        // 发送请求查询账号是否存在，密码是否正确
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $('.loginInput').serialize(),
            success: function (res) {
                // 当登录不成功时的提示信息
                if (res.status !== 0) {
                    return alertError(res.message)
                }
                // 登陆成功提示信息
                alertCorrect(res.message)
                // 用浏览器保存服务器返回的taken属性--用于权限接口的身份认证
                localStorage.setItem('token',res.token)
                // 跳转主页
                location.href = './index.html'
            }
        })
    })

    // 注册账号模块
    // 用户名验证规则----注册
    let usernameReg = /^\w{2,8}$/
    // 密码验证规则----注册
    let pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
    $('.regInput').on('submit', function (e) {
        e.preventDefault()
        // 点击注册按钮时，
        if (!$.trim($('#reguname').val()) || !$.trim($('#regpwd').val()) || !$.trim($('#regpwdConfirm').val())) {
            return alertError("必填项不能为空")
        }
        // 用户名的判断
        if (!usernameReg.test($('#reguname').val())) {
            if (!($('#reguname').val().length >= 2 && $('#reguname').val().length <= 8)) {
                return alertError("用户名必须为2至8位非空字符串")
            } else {
                return alertError("用户名只能包含字母、数字、下划线")
            }
        }
        // 密码判断
        if (!pwdReg.test($('#regpwd').val())) {
            if (!($('#regpwd').val().length >= 6 && $('#regpwd').val().length <= 16)) {
                return alertError("密码必须为6到16位非空字符串")
            } else if (/\s/.test($('#regpwd').val())) {
                return alertError("密码必须为在6到16位非空字符串")
            } else {
                return alertError("密码不能为纯数字或纯字母且不能有特殊字符")
            }
        }

        // 确认密码验证
        if (!($('#regpwdConfirm').val() === $('#regpwd').val())) {
            return alertError("两次密码不一致！")
        }

        // 发起ajax请求
        let data = $('.regInput').serialize()
        let index = data.lastIndexOf("&")
        data = data.slice(0, index)
        // console.log(data);
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: data,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    // 注册失败提示信息
                    return alertError(res.message)
                }
                // 注册成功时，清空注册表单的内容--reset()为DOM方法，jQuery元素需进行转换
                $('.regInput')[0].reset()
                // 手动调用点击 “已有账号去登录” 链接
                $('#link-login').trigger('click')
                // 弹出提示信息
                return alertCorrect("注册成功！请登录")

            }
        })

    })

    // alertCorrect(msg)
    // 注册成功弹出提示框
    function alertCorrect(msg) {
        $('.hint-icon').addClass('glyphicon-ok')
        $('.hint').show().find('.hint-msg').html(msg)
        setTimeout(function () {
            $('.hint').fadeOut()
            $('.hint-icon').removeClass('glyphicon-ok')
        }, 2000)
    }

    // 表单验证错误弹出警示框
    function alertError(msg) {
        $('.hint-icon').addClass('glyphicon-remove')

        $('.hint').show().find('.hint-msg').html(msg)

        // 抖动提示框
        $('.hint').shake(3, 5, 300)
        // 两秒后隐藏提示框
        setTimeout(function () {
            $('.hint').fadeOut()
            $('.hint-icon').removeClass('glyphicon-remove')
        }, 2000)
    }
    // 抖动函数  $("抖动元素").shake(次数, 距离, 持续时间);
    jQuery.fn.shake = function (intShakes, intDistance, intDuration) {
        this.each(function () {
            var jqNode = $(this);
            // jqNode.css({ position: 'absolute' });
            for (var x = 1; x <= intShakes; x++) {
                jqNode.animate({
                        left: $('.hint').position().left + $('.hint').outerWidth() / 2 + (intDistance * -1)
                    }, (((intDuration / intShakes) / 4)))
                    .animate({
                        left: $('.hint').position().left + $('.hint').outerWidth() / 2
                    }, ((intDuration / intShakes) / 2))
                    .animate({
                        left: '50%'
                    }, (((intDuration / intShakes) / 4)));
            }
        });
        return this;
    }


})