// 注意: 每次调用 $.get()  $.post()   $.ajax()的时候,
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中,可以拿到给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // options.url += 'http://ajax.frontend.itheima.net';
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url)
})