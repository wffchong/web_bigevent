$(function() {

    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
        // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
        const dt = new Data(data)

        let y = padZero(dt.getFullyear())
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义一个补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询对象的参数,将来请求数据的时候
    // 需要交请求参数对象发给服务器
    const q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章发布的状态
    }

    initTable()
    initCate()

    // 获取文章分类列表的数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 调用模板引擎渲染列表
                let htmlStr = template('tmp-table', res)
                $('tbody').html(htmlStr)

                // 渲染完数据后需要在渲染分页
                renderPage(res.total)
            }
        })
    }


    // 初始化文章分类的方法下拉框
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 调用模板引擎渲染列表
                let htmlStr = template('tmp-cate', res)
                    // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)

                // 通过 layui 重新渲染下表单区域的ui结构
                form.render()
            }
        })
    }

    // 为筛选按钮绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        // 获取表单中的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()

        // 将表单中的值赋值给q
        q.cate_id = cate_id
        q.state = state
        console.log(q);
        // 根据最新的筛选条件,重新渲染表格数据
        initTable()
    })

    // 定义一个渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示的条数。laypage将会借助 count 和 limit 计算出分页数。
            curr: q.pagenum, //起始页

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function(obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(first)
                // console.log(obj.curr)

                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr

                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit

                // initTable()
                if (!first) {
                    initTable()
                }
            }
        });
    }

    // 为删除按钮绑定点击事件通过代理
    $('tbody').on('click', '.btn-delete', function() {
        // 获取当前删除按钮的数剧
        let len = $('.btn-delete').length

        // console.log(len);
        // console.log('1231');
        // 获取到文章的Id
        let id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除成功')

                    // 当数据删除完成后,需要判断这一页里面还没有数据
                    // 当没有剩余的数据的时候,删除数据后页码值 减 1 
                    // 然后在重新调用initTable
                    if (len == 1) {
                        // 如果len 等于1,代表点击的时候页面只有一个删除按钮了
                        // 还需要判断页码值是否为1，要是为1的话就算没数据了也不能减一
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })


})