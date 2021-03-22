$(function() {
    let form = layui.form

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同!'
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码输入不一样!'
            }
        }
    });

    $('.layui-form').on('submit', function(e) {

        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layui.layer.msg('更新密码失败')
                }
                layui.layer.msg('更新密码成功')

                // 更新好了重置表单
                // 原生js有个 reset 方法
                $('.layui-form')[0].reset()
            }
        })
    })

    $('btnReset').on('click', function() {
        $('.layui-form')[0].reset()
    })
})