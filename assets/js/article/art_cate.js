$(function() {
    let form = layui.form
    let layer = layui.layer
    ininArtCateList()

    // 获取文章分类列表
    function ininArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                let htmlStr = template('tmp-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }


    let indexAdd = null

    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-add').html(),
            area: ['500px', '250px']
        });
    })

    // 这里不能直接 $('form-add').on 绑定事件,因为这个表单是动态添加的
    // 需要通过代理的形式绑定事件,可以给Body添加。
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('添加分类失败')
                }
                // 成功重新渲染哈表单
                ininArtCateList()
                layer.msg('添加成功')

                // 根据索引关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的方式为form-edit绑定事件
    let indexEdit = null
    $('tbody').on('click', '#btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-edit').html(),
            area: ['500px', '250px']
        });

        let id = $(this).attr('data-id')

        // 发起数据请求获取内容
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)

                // console.log(res);
            }
        })
    })

    // 通过代理的方式为form-edit绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)

                // 成功后重新绘制表单
                ininArtCateList()
            }
        })
    })

    // 通过代理的方式为删除按钮绑定事件
    $('tbody').on('click', '#btn-delete', function() {
        let id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status != 0) {
                        return layer.msg('删除文章分类失败')
                    }
                    // console.log('object');
                    layer.msg('删除成功')
                    layer.close(index)
                    ininArtCateList()
                }
            })

        });

    })

})