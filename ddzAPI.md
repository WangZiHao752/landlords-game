## 

### 登录 notify

请求参数

```
{
      cmd:"wxlogin",
      data:{
         uniqueID:"a1362323884",
      }
      callindex:1
 }
```



响应

```
{
   type: "login_resp", 
   result: 0, 
   data: {
   	  goldcount: 99999
   }, 
   callBackIndex: 1
}

```

### 加入房间notify

请求参数

```
{
    cmd:"joinroom_req",
    data:{
        roomid:roomid,
    },
    callindex:1
}
```

响应

```
{
	callBackIndex: 1
    data:{
        bottom: 50
        gold: 200
        rate: 4
        roomid: "004458" 
    }
    result: 0
    type: "joinroom_resp"
}
```



### 玩家进入房间通知

响应

```
{
	callBackIndex: 0,
	data:{
        accountid: "suxiang",
        avatarUrl: "https://wx.Q/64",
        goldcount: 100000,
        nick_name: "苏祥牛逼666",
        seatindex: 3,
    },
	result: 0,
	type: "player_joinroom_notify",
}

```



### 获取房间人员列表

请求参数

```
{
	cmd: "enterroom_req",
    data: {
      roomid: '607118',
    },
    callindex: 1,
}
```



响应

```
 {
 	type: "enter_room_resp", 
 	result: 0, 
 	data: {
 		housemanageid: "a1362323884",
 		playerdata:[
 			{
                accountid: "a1362323884",
                avatarUrl: "https://profile.csdnimg.c88",
                goldcount: 9999999999,
                isready: false,
                nick_name: "豪哥万岁",
                seatindex: 1,
 			},
 			{
                accountid: "admin",
                avatarUrl: "https://mmbiz.qpic.cn/mmbiz_png/1",
                goldcount: 99999999999,
                isready: false,
                nick_name: "管理大大",
                seatindex: 2,
 			},
 			{
                accountid: "suxiang"
                avatarUrl: "https://wx.qlogTwOgllAicoyrkbGYQ/64"
                goldcount: 100000
                isready: false
                nick_name: "苏祥牛逼666"
                seatindex: 3
 			}
 			
 		]
 		roomid: "607118"
		seatindex:1
 	}, 
 	callBackIndex: 1
 } 

```

### 准备

请求参数示例

```
{
	cmd: "player_ready_notify",
    data: {
      roomid: '607118',
    },
    callindex: 1,
}
```

响应示例

```

```



 ### 房主发送开始游戏消息

请求示例

```
{
	cmd: "player_start_notify",
    data: {
      roomid: '607118',
    },
    callindex: 1,
}
```

响应示例

会收到3次响应

1. gameStart_notify  //通知房间人员开始了

2. pushcard_notify   //手中的牌

   ```
   {
       callBackIndex: 0
       data: [{
           index: 33
           shape: 2
           value: 8
   	}, {…}, {…}, {…}, {…}, {…}, ...],
    result: 0,
       type: "pushcard_notify",
}
   ```
   
   3. canrob_notify  //通知谁可以抢dz
   
      ```
      {
          callBackIndex: 0
          data: "a1362323884"
       result: 0
          type: "canrob_notify"
      }
      ```
   
      





### 客户端发送抢地主消息

请求示例

```
{
	cmd: "player_rob_notify",
    data: {
      roomid: '607118',
    },
    callindex: 1,
}
```



响应示例

```

```



#### 抢地主状态 canrob_state_notify

抢

```
"buqiang":0,
"qian":1,
```



#### 地主通知 

```
{
	callBackIndex: 0
    data: "a1362323884"
    result: 0
    type: "change_master_notify"
}
```

### 底牌显示

```
{
    callBackIndex: 0
    data:[{
        index: 6
        shape: 3
        value: 1
    }, {…}, {…}]
    result: 0
    type: "change_showcard_notify"
}
```



### 可以出牌的人

```
{
    callBackIndex: 0
    data: "a1362323884"
    result: 0
    type: "can_chu_card_notify"
}
```





### 不出

chu_bu_card_req

### 出

chu_card_req

```
{
	cmd: 'chu_card_req',
    data: [{
    	cardid:24,
    	card_data:{
    		index:24,
    		value:6,
    		shape:1
    	}
    },]
    callindex: 1,
}
```







#### 出pai响应 chu_card_res

- 成功

```
{
	type:0
}
```

- 失败

  ```
  {
  	type:-2
  }
  ```

  





