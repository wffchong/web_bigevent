$(function() {
    getUserInfo()
    let layer = layui.layer;
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 先清楚 localStorage 里面存储的 token
            localStorage.removeItem('token')

            location.href = 'login.html'
                // 关闭弹出框
            layer.close(index);
        });
    });
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 调用 renderAvatat
            renderAvatat(res.data)
        },

        // 无论成功和失败,最终都会执行这个回调函数
        // complete: function(res) {
        //     console.log('ok');
        //     // console.log(res);
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
        //         // 强制清空token
        //         localStorage.removeItem('token')

        //         console.log('123');
        //         // 强制回到login页面
        //         location.href = 'login.html'
        //     }
        // }
    })
}

function renderAvatat(user) {
    // 1：获取用户名称
    let name = user.nickname || user.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    if (user.user_pic != null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}