$(function () {
    // 图片裁剪配置项

    $('.container > img').cropper({
        aspectRatio: 1,
        // 定义预览区域
        preview: ".img-preview",
        // 是否允许放大缩小图片
        zoomable: false
    });




    // 点击选择图片时模拟点击文件上传框
    $('.chooseImg').on('click', function () {
        $('#file').click()
    })

    // 将用户选择的图片放入裁剪区内
    $('#file').on('change', function (e) {
        // 获取用户选择的图片
        let file = e.target.files[0]
        // 根据选择的图片创建对应的URL地址
        let newImgURL = URL.createObjectURL(file)
        console.log(newImgURL);
        // 销毁旧裁剪区的图片，然后重新设置用户选择图片的文件的UTL地址给src,然后创建新的裁剪区域
        $('.container > img').cropper('destroy')
        $('.container > img').prop('src', newImgURL)
        $('.container > img').cropper({
            aspectRatio: 1,
            // 定义预览区域
            preview: ".img-preview",
            // 是否允许放大缩小图片
            zoomable: false
        });
    })

    // 上传图片
    $('.btnUpload').on('click', function () {
        // 获取用户裁剪的图片
        let dataURL = $('.container > img').cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toDataURL('image/png')

        // 调用接口，把头像上传至服务器
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return hintwin($('.hint'), '更换头像失败!', $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
                }
                window.parent.getUserInfo()
                return hintwin($('.hint'), '更换头像成功!', $('.hint-msg'), "rgb(128, 255, 0)", '&#xe638;', $('.hint-icon'), false)
            }
        })
    })

})