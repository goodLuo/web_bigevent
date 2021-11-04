$(function () {
    $(document).on("show.bs.modal", ".modal", function () {
        $(this).draggable({
            handle: ".modal-header" // 只能点击头部拖动
        });
        $(this).css("overflow", "hidden"); // 防止出现滚动条，出现的话，你会把滚动条一起拖着走的
    });


    // 调用 initArtCateList() 函数获取文章分类数据
    initArtCateList()

    // 点击重置按钮，清空表单中的内容
    $('.reForm').on('click', function () {
        $('.form-horizontal')[0].reset()
    })

    // 发起请求 添加文字分类数据
    $('.addclassify').on('click', function () {
        // console.log($('.form-horizontal').serialize());
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $('.add').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return hintwin($('.hint'), res.message, $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
                }
                $('.close').click()
                initArtCateList()
                return hintwin($('.hint'), res.message, $('.hint-msg'), "rgb(128, 255, 0)", '&#xe638;', $('.hint-icon'), false)
            }
        })
    })

    $('.close').on('click', function () {
        $('.edit')[0].reset()
    })

    // 编辑
    var Id = ''
    $('body').on('click', ".btn-edit", function () {
        // 获取当前分类的ID
        let id = $(this).attr('data-id')
        Id = id
        // 发起请求
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return hintwin($('.hint'), "当前分类修改正在维护,请稍后尝试", $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
                }
                $('.catName').val(res.data.name)
                $('.catAlias').val(res.data.alias)
            }
        })
    })


    // 确认修改
    $('.sureEdit').on('click', function (e) {
        console.log($('.edit').serialize() + "&id=" + Id);
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $('.edit').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return hintwin($('.hint'), res.message, $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
                }
                $('.close').click()
                initArtCateList()
                return hintwin($('.hint'), res.message, $('.hint-msg'), "rgb(128, 255, 0)", '&#xe638;', $('.hint-icon'), false)
            }
        })

    })

    // 删除
    $('body').on('click', '.btn-rm', function () {
        let id = $(this).attr("data-id")
        $('.rmBut').on('click', function () {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return hintwin($('.hint'), res.message, $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
                    }
                    $('.cancelBut').click()
                    initArtCateList()
                    return hintwin($('.hint'), res.message, $('.hint-msg'), "rgb(128, 255, 0)", '&#xe638;', $('.hint-icon'), false)
                }
            })
        })
    })




})

// 发起请求获取 文章分类列表数据 
function initArtCateList() {
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            // console.log(res.data);
            if (res.status !== 0) {
                return hintwin($('.hint'), '获取文章分类列表失败', $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))

            }
            let htmlStr = template('tpl-table', res)
            $('.classifyList').html(htmlStr)
        }
    })
}