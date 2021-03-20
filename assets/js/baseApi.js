// 注意: 每次调用 $.get()  $.post()   $.ajax()的时候,
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中,可以拿到给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // options.url += 'http://ajax.frontend.itheima.net';
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    // console.log(options.url)

    // 统一为有权限的的接口,加headers
    // 只有路径包含 /my 才加 headers
    if (options.url.indexOf('/my') != -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    options.complete = function(res) {
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token')

            console.log('123');
            // 强制回到login页面
            location.href = 'login.html'
        }
    }
})