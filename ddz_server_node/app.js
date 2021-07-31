const mydb = require("./db.js")
const gamectr = require("./game/game_ctr.js")
// const db_config = require("./db_config.js")
let _app = require('express');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server,{
  cors:{
    origin:'*'
  }
});

app.use( _app.static('./public'));

mydb.connect({
   "host": 'localhost',
   "port": 3306,
   "user": 'wangzihao666',
   "password": 'wangzihao666',
   "database": 'ddz',
})

io.on("connection",function(socket){
   console.log("a new connectin")
   //告知浏览器连接成功
   socket.emit("connection","connection  sucess")

   //通知
   socket.on("notify",function(req){
      console.log("notify" + JSON.stringify(req))
      console.log("msg: "+req.cmd)
     
      var data = req.data
      switch(req.cmd){
         case "wxlogin":
            var uniqueId = data.uniqueID
            //console.log("login uniqueId:"+uniqueId)
            mydb.getPlayerInfoByUniqueID(uniqueId,function(err,result){
               if (err){
                  console.log("getPlayerInfoByUniqueID err"+err)
               }else{
                  if(result.length===0){
                     //没有用户数据，创建一个
                    var userinfo = {
                        uniqueID:data.uniqueID,
                        accountID:data.accountID,
                        nickName:data.nickName,
                        goldCount:1000,
                        avatarUrl:data.avatarUrl,
                    }
                    mydb.createPlayer(userinfo)
                    //data = [{"unique_id":"1328014","account_id":"2117836",
                    //"nick_name":"tiny543","gold_count":1000,
                    //"avatar_url":"http://xxx"}]
                    gamectr.create_player(
                       {
                        unique_id:data.uniqueID,
                        account_id:data.accountID,
                        nick_name:data.nickName,
                        gold_count:1000,
                        avatar_url:data.avatarUrl,
                       },
                       socket,
                       req.callindex
                    )
                  }else{
                     //取到数据
                     console.log('data = ' + JSON.stringify(result));
                     console.log('req.callindex',req.callindex);
                     /*创建玩家 
                        result[0]：sql查询的数据
                        socket：soket对象
                        callindex:拜访下标
                     */
                     gamectr.create_player(result[0],socket,req.callindex)
                  }
               }
            })
            break
         case "":{}break
            default:
            console.log("default process msg: "+req.cmd)
            break;
      }
   })
})
io.on('connect',(socket)=>{
   console.log('连接成功');
   
   socket.emit('open', {
     statu: '连接成功',
   });
 
 })


server.listen(8888,console.log('http://localhost:8888'));


