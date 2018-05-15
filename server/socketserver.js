var functionArray = [];

functionArray["source-a"] = function sourceA() {
  console.log('in a')
  var ServData = {}
  ServData.name = "source-a"
  setInterval(function() {
    ServData.data = '北京时间：'+ new Date((new Date()).getTime() - 10)
    // 每隔1s触发‘datacome’，发送ServData
    io.sockets.emit("datacome", ServData)
  },1000)
}

functionArray["source-c"] = function sourceC() {
  console.log('in c')
  var ServData = {}
  ServData.name = "source-c"
  setInterval(function() {
    ServData.data = '../static/image/source-c/c'+ Math.round(Math.random()*10)%3 +'.jpg'
    io.sockets.emit("datacome", ServData)
  },3000)
}

functionArray["source-d"] = function sourceD() {
  console.log('in d')
  var ServData = {}
  ServData.name = "source-d"
  setInterval(function() {
    ServData.data = '../static/image/source-d/d'+ Math.round(Math.random()*10)%6 +'.gif'
    io.sockets.emit("datacome", ServData)
  },3000)
}

functionArray["source-e"] = function sourceE() {
  console.log('in e')
  var ServData = {}
  ServData.name = "source-e"
  var data = new Array()
  ServData.data = data
  setInterval(function(){
    data[0] = (new Date()).getTime()
    data[1] = Math.round(Math.random() * 100)
    // console.log(data)
    io.sockets.emit("datacome", ServData)
  },1000);
}

/* 测试用 */
functionArray["map2"] = function MAP2() {
  console.log('in map2');
  var ServData = {}
  ServData.name = "map2"
  var data = new Array()
  ServData.data = data
  
  setInterval(function(){
    var random = Math.floor(Math.random()*5)
    for(let i=0; i<random; i++){
      data[i] = new Array()
     // data[i][0] = Math.round(Math.random() * 230)
     // data[i][1] = Math.round(Math.random() * 200)
     data[i][0] = (Math.random() * 3) * 0.1 + 109.2
     data[i][1] = (Math.random() * 3) * 0.1 + 18.1
    }
    console.log(data)
    io.sockets.emit("datacome", ServData)
  },3000);
}
/* 测试用 */

/*functionArray["map1"] = function MAP1() {
  console.log('in map1');
  // var ServData = {}
  // ServData.name = "map1"
  // var data = new Array()
  // ServData.data = data
  
  // setInterval(function(){
  //   var random = Math.floor(Math.random()*5)
  //   for(let i=0; i<random; i++){
  //     data[i] = new Array()
  //     data[i][0] = Math.round(Math.random() * 230)
  //     data[i][1] = Math.round(Math.random() * 200)
  //   }
  //   console.log(data)
  //   io.sockets.emit("datacome", ServData)
  // },3000);

  const WebSocket = require('ws');
  const ws = new WebSocket('ws://10.108.95.123:8082');

  ws.on('open', function open() {
  ws.send('something');
  console.log("connect");
  });

  ws.on('message', function incoming(data) {
    var ServData = {}
    var datajson = JSON.parse(data)
    console.log(data);
    
    var tarr = [datajson.longitude, datajson.latitude];
    ServData.name = "map1"
    var dotdata = new Array()
    dotdata.push(tarr)
    ServData.data = dotdata
    io.sockets.emit("datacome", ServData)
  });
  
  ws.on('close', function close() {
    console.log('disconnected');
  });
}*/




var io = require('socket.io').listen(8089);
io.sockets.on('connection', function (socket) {
  console.log("Connection " + socket.id + " accepted.");

  socket.on('disconnect', function () {
    console.log("Connection " + socket.id + " terminated.");
  });
  socket.on("newmsg",function(data){
    console.log(data)
  });
  socket.on("dot", function(data){
    console.log(data)
  })
  socket.on("bind", function(data){
  	console.log('bind:' + data)
    if(functionArray[data]){
      functionArray[data]()
    }
  })
});

console.log('hahahah')