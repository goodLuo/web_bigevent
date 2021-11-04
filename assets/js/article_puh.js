$(function () {
    // 文本编辑器
    $(document).ready(function () {
        $("#txtEditor").Editor();
    });

    // 图片裁剪配置项
    $('.container > img').cropper({
        aspectRatio: 4 / 2.8,
        // 定义预览区域
        preview: ".img-preview",
        // 是否允许放大缩小图片
        zoomable: false,
        // background:false
    });

    // 调用 getArticleClassify() 方法 渲染文章分类列表
    getArticleClassify()
    // 加载页面时发送请求获取文章类别列表
    function getArticleClassify() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return hintwin($('.hint'), res.message, $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
                }

                // 请求成功后使用模版引擎渲染数据
                let htmlStr = template('tpl-articleClassify', res)
                $('select[name=cate_id]').html(htmlStr)

            }
        })
    }


    // 点击选择封面
    $('.choose-btn').on('click', function () {
        $('.cover input[type=file]').click()
    })

    // 将用户选择的图片放入裁剪区
    $('#coverFile').on('change', function (e) {
        // 获取用户选择的图片
        let file = e.target.files[0]
        // 根据选择的图片创建对应的URL地址
        let newImgURL = URL.createObjectURL(file)
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


    // 定义文章的状态
    let art_state = "已发布"

    //如果点击了存为草稿，则将文章的状态改为 草稿
    $('.btnSava2').on('click', function () {
        art_state = '草稿'
    })

    
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 基于form表单，快速创建 FormData 对象
        let fd = new FormData($(this)[0])
        // 往 FormData 对象追加数据
        fd.append('state', art_state)
        fd.append('content', $('.Editor-editor').html())

        // 获取用户裁剪的图片
        $('.container > img').cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(function (blob) { // 将Canvas画布上的内容转换为文件对象
            // console.log(blob);
            fd.append('cover_img', blob)
            // 发起请求 添加文章
            publishArticle(fd)
        })
    })

    function publishArticle(fd) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType:false,
            processData:false,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return hintwin($('.hint'), res.message, $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
                }
                window.parent.$('.article_list').click()
                // location.href = './article_list.html'
                    
            }
        })
    }


})