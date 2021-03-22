$(function() {
    let form = layui.form

    form.verify({
        nickname: function(value) { //value：表单的值、item：表单的DOM对象
            if (value.length > 6) {
                return '昵称长度必须在 1-6 位之间'
            }
        }
    });

    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('获取用户的信息失败')
                }
                console.log(res);
                // 调用form.val快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 监听表单的提交事件
    $('.layui-form').on('sumblit', function() {
        // 阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')

                // 调用父页面的 getUserInfo 方法,重新绘制头像名字
                window.parent.getUserInfo()
            }
        })
    })

    // 重置表单的数据
    $('#btnReset').on('click', function() {
        e.preventDefault()
        initUserInfo()
    })
})