$(function() {

    let layer = layui.layer
    let form = layui.form
    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('获取文章分类列表数据失败')
                }

                // 调用模板引擎渲染数据
                let htmlStr = template('tmp-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 一定不能忘记调用 form.render() 重新渲染表单结构
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 监听文件选择框的change事件
    $('#coverFile').on('change', function(e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]
        if (file.length == 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
            // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    let art_state = '已发布'

    $('#btnSave2').on('click', function() {
        art_state = '存为草稿'
    })

    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()

        // 基于 form 表单 , 快速创建一个 FormDate 对象
        let fd = new FormData($(this)[0])

        // 讲发布的文章的状态,存到 fd 中
        fd.append('state', art_state)


        // fd.forEach(function(v, k) {
        //     console.log(k, v);
        // })

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象,保存到formdata中
                fd.append('cover_img', blob)

                // 发起ajax请求
                publishArtrice(fd)
            })

    })

    function publishArtrice(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意---如果像服务器提交的是FormData数据，必须要有下面两个属性
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.href = 'art_list.html'
            }
        })
    }
})