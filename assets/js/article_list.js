$(function () {
    // 定义查询的参数对象，发送请求时需将请求参数对象发送至服务器
    let q = {
        pagenum: 1, // 页码，默认为第一页
        pagesize: 5, // 每页显示多少条数据，默认为每页两条
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的状态，可选值有：已发布、草稿
    }
    // 调用 getArticleList() 函数获取文章列表数据
    getArticleList()
    // 调用 getArticleClassify() 获取文章分类列表数据 
    getArticleClassify()

    /*
        筛选功能:
            1、点击筛选时，监听表单提交事件，阻止表单默认提交行为
            2、先获取用户选择的 分类 和 状态 对应的值
            3、将 分类和状态 的值分别填充到 q参数对象cate_id和state属性 中
            4、使用 参数对象q 重新发起获取文章列表数据
    
    */
    $('.filter').on('submit', function (e) {
        e.preventDefault()

        q.cate_id = $('.cate_id').val()
        q.state = $('.state').val()

        // 调用 getArticleList() 函数获取文章列表数据
        getArticleList()
    })

    // 获取文章分类列表数据 getArticleClassify()
    function getArticleClassify() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return hintwin($('.hint'), res.message, $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
                }
                // 调用 模版引擎 渲染数据
                let htmlStr = template('tpl-articleClassify', res)
                $('.cate_id').html(htmlStr)
            }
        })
    }

    // 获取文章列表数据函数 getArticleList() 函数
    function getArticleList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return hintwin($('.hint'), res.message, $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
                }

                // 使用模版引擎渲染数据
                let htmlStr = template('tpl-articleList', res)
                $('.articleList').html(htmlStr)

                // 渲染完文章列表数据后，开始渲染分页
                renderPage(res.total)
            }
        })
    }
    // 定义渲染分页的 renderPage 方法
    function renderPage(total) {
        // 初始化分页插件
        $('#pagination1').jqPaginator({
            totalCounts: total, // 数据总数
            pageSize: q.pagesize, // 每页最多显示几条数据
            visiblePages: 5, // 设置最多显示的页码数
            currentPage: q.pagenum, // 设置当前的页码

            first: '<li class="first"><a href="javascript:void(0);">首页</a></li>',
            prev: '<li class="prev"><a href="javascript:void(0);"><<</a></li>',
            next: '<li class="next"><a href="javascript:void(0);">>></a></li>',
            last: '<li class="last"><a href="javascript:void(0);">尾页</a></li>',
            page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
            // 当发生切换页码时触发回调函数，有两个参数：目标页（num），触发类型（可能的值：“init”（初始化），“change”（点击分页））
            onPageChange: function (num, init) {
                // 防止死循环，初始化也会调用此回调函数
                if (!(init == "init")) {
                    // 把最新的页码值赋值到 q参数对象中，然后重新发起ajax请求获取列表数据
                    q.pagenum = num
                    getArticleList()
                }


            }
        });

    }

    // 定义美化时间格式的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    // 补零函数
    function padZero(num) {
        return num >= 10 ? num : "0" + num
    }


    // 删除文章----列表数据通过模板引擎渲染，所以需用事件委托进行绑定事件
    $('.articleList').on('click', '.rm-btn', function () {
        // 获取当前文章的ID
        let id = $(this).attr('data-id')
        // 获取当前页面 删除按钮 的个数
        let count = $(this).length
        // 如果点击弹出框的确定按钮
        $('.rmBut').on('click', function () {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        console.log(1111);
                        return hintwin($('.hint'), res.message, $('.hint-msg'), "rgb(255, 90, 90)", '&#xe60f;', $('.hint-icon'))
                    }
                    $('.close').click()
                    // 删除成功重新渲染文章列表数据
                    hintwin($('.hint'), res.message, $('.hint-msg'), "rgb(128, 255, 0)", '&#xe638;', $('.hint-icon'), false)


                    // 当数据删除完成后，判断当前页是否还剩余有文章列表数据，如果没有剩余的数据，则将页面值 -1 后重新发送请求渲染数据
                    //如果当前页面删除按钮的个数 为1 且数据删除成功，则表示当前页面已经没有数据，则将页码值 -1 
                    if (count == 1) {
                        q.pagenum = q.pagenum == 1 ? q.pagenum : q.pagenum - 1
                    }
                    console.log(11);

                    getArticleList()

                }
            })
        })
    })
})