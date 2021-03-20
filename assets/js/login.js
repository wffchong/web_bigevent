$(function() {
    // 点击去注册
    $('#link-reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    // 点击去登录
    $('#link-login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 从 layui 中获取form对象
    let form = layui.form;
    let layer = layui.layer

    // 通过form.verify()函数自定义校验规则
    form.verify({
        // username: function(value, item) { //value：表单的值、item：表单的DOM对象
        //     if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
        //         return '用户名不能有特殊字符';
        //     }
        //     if (/(^\_)|(\__)|(\_+$)/.test(value)) {
        //         return '用户名首尾不能出现下划线\'_\'';
        //     }
        //     if (/^\d+\d+\d$/.test(value)) {
        //         return '用户名不能全为数字';
        //     }

        //     //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
        //     if (value === 'xxx') {
        //         alert('用户名不能为敏感词');
        //         return true;
        //     }
        // },

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]

        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        // 用函数的方法设置确认密码的自定义校验
        // value是输入框的值
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的值
            // 需要拿到密码框的值,判断两个值是否相等,如果不相等 return 一个提示消息
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次输入的密码不一致,请重新输入'
            }
        }
    });

    // 监听注册表单的提交事件
    $('#form-reg').on('submit', function(e) {
        // 提交前先阻止默认提交行为
        e.preventDefault();
        let data = {
            username: $('#form-reg [name=username]').val(),
            password: $('#form-reg [name=password]').val()
        }

        // 发起 Ajax 的 post 请求,
        $.post('/api/reguser', data, function(res) {
            // 注册失败
            if (res.status !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message);
            }
            // 注册成功
            // console.log('注册成功');
            layer.msg(res.message);
            // 注册成功弹出消息时自动跳转到登录界面
            // 模拟人的点击行为
            $('#link-login').click();
        });
    })

    // 监听登录表单的提交事件
    $('#form-login').submit(function(e) {
        // 阻止默认的跳转行为
        e.preventDefault();
        // 发起Ajax请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单信息,jq 里面的 serialize() 方法
            data: $(this).serialize(),
            success: function(res) {
                // 登陆失败
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                // 登陆成功
                layer.msg('登陆成功');
                // 将登录成功后返回的 token 字符串 存储到 localStorage 中
                localStorage.setItem('token', res.token);
                // 跳转到主页
                location.href = 'index.html'
            }
        })

    })
})