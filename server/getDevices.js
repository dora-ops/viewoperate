var http = require('http');

http.get('http://10.109.252.73:7000/devices', function(res) {
    console.log('get response Code :' + res.statusCode);
    var body = "";
    res.on('data', function(chunk) {
        body += chunk;
    });
    res.on('end', function() {
        // 解析参数
        body = JSON.stringify(body);
        // body = body.toString();
        console.log('返回结果：' + body);
    }).on('error',function(e){
        console.log("Got error: " + e.message);
    });
})
