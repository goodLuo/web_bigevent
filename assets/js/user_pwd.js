$(function () {
    $('.form-con').on('submit', function (e) {
        e.preventDefault()
        // 新密码是否符合规则--不能是纯数字或纯字母的6-16位之间
        let newPwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z-_!]{6,16}$/
        if (!newPwdReg.test($('.newPwd').val())) {
            if (!($('.newPwd').val().length >= 6 && $('.newPwd').val().length <= 16)) {
                return hintwin($('.hint'), '密码必须为在6到16位非空字符串', $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
            } else if (/\s/.test($('.newPwd').val())) {
                return hintwin($('.hint'), '密码必须为在6到16位非空字符串', $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
            } else if ($('.newPwd').val() == $('.oldPwd').val()) {
                return hintwin($('.hint'), '新密码和原密码不能相同', $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
            } else {
                return hintwin($('.hint'), '密码不能为纯数字或纯字母且不能有特殊字符', $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
            }
        }

        // 确认密码验证
        if (!($('.newPwdConfirm').val() === $('.newPwd').val())) {
            return hintwin($('.hint'), '两次密码不一致', $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
        }

        // 发起请求更改密码
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return hintwin($('.hint'), res.message, $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
                }
                return hintwin($('.hint'), res.message, $('.hint-msg'), "rgb(128, 255, 0)", '&#xe638;', $('.hint-icon'),false)

            }
        })



    })
})