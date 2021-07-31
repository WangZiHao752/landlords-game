<template>
  <div class="room-wrapper">
    <van-nav-bar
      title="房间"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="room-main">
      <van-row type="flex" justify="center">
        <van-col span="8" class="top-col">
        <van-steps :active="currentSendCard">
          <van-step v-for="v in roomPlayer" :key="v.accountid">{{v.nick_name}}</van-step>
        </van-steps>
        </van-col>
        <!-- 底牌-->
        <van-col span="8" class="top-col">
          <div class="pick-box">
              <div class='card' :class="{active:v.active}" :style="{left:8+i+'em'}" v-for="(v,i) in showKardList" :key="v.index">
                  <div class="face"> {{v.king|king}}</div>
                  <div class="topleft">{{v.value|cardNum}}</div>
                  <div class="bottomright">{{v.value|cardNum}}</div>
              </div>
          </div>
        </van-col>
      </van-row>
      <van-row type="flex" justify="space-between">
        <!-- 其他两个玩家-->
        <van-col span="8" class="high-col" v-for="item in otherPlayer" :key="item.avatarUrl">
          <div class="avatar">
            <img :src="item.avatarUrl" alt="">
          </div>
          <div >{{item.nick_name}}</div>
          <div v-if="item.isready">已准备</div>
          <div>💎{{item.goldcount}}</div>
          <div v-if="item.isLandlord" :style="{'font-size':'50px'}">👲</div>
          <div class="surplusCardLength" v-if="startedBtnHidden">
            还剩下{{item.surplusCardLength}}张
          </div>
          <!-- 其他玩家上次出的牌 -->
          <div class="other_prevCard-box">
              <div class='card' :class="{active:v.card_data.active}" :style="{left:8+i+'em'}" v-for="(v,i) in item.prevCard" :key="v.card_data.index">
                  <div class="face"> {{v.card_data.king|king}}</div>
                  <div class="topleft">{{v.card_data.value|cardNum}}</div>
                  <div class="bottomright">{{v.card_data.value|cardNum}}</div>
              </div>
          </div>
        </van-col>
      </van-row>
      <van-row type="flex" justify="center">
        <van-col span="20" class="high-col">
          <!-- 自己上次出的牌 -->
          <div class="self_prevCard-box">
              <div class='card' :class="{active:v.card_data.active}" :style="{left:8+i+'em'}" v-for="(v,i) in self_prevCard" :key="v.card_data.index">
                  <div class="face"> {{v.card_data.king|king}}</div>
                  <div class="topleft">{{v.card_data.value|cardNum}}</div>
                  <div class="bottomright">{{v.card_data.value|cardNum}}</div>
              </div>
          </div>
          <!-- 准备 开始 抢 不抢 按钮 -->
          <van-row type="flex" justify="center" v-if="!startedBtnHidden">
            <van-col span="4">
              <van-button
                round
                type="info"
                :disabled="readyDisable"
                @click="ready"
                >准备</van-button
              >
            </van-col>
            <van-col span="4" v-if="housemanageid == uid && !gameStarted">
              <van-button
                round
                type="info"
                :disabled="!startDisable"
                @click="start"
                >开始</van-button
              >
            </van-col>
             <van-col span="4" v-if="robDisable">
              <van-button
                round
                type="info"
                @click="rob('rob')"
                >抢</van-button
              >
              <van-button
                round
                type="warning"
                @click="rob('noRob')"
                >不抢</van-button
              >
            </van-col>
          </van-row>
          <!-- 出不出按钮 -->
          <van-row type="flex" justify="center" v-if="startedBtnHidden">
            <van-col span="12">
              <van-button
                round
                type="info"
                :disabled="!sendCardFlag"
                @click="sendCard('send')"
                >出</van-button
              >
              <van-button
                round
                type="warning"
                :disabled="!sendCardFlag"
                @click="sendCard('pass')"
                >不出</van-button
              >
            </van-col>
          </van-row>
          <div class="landlord"><span v-if="isMeLandlord">👲</span></div>
          <!-- 自己当前的牌 -->
          <div class="pick-box">
              <div class='card' :class="{active:v.active}" :style="{left:8+i+'em'}" v-for="(v,i) in cardList" :key="v.index" @click="activeCard(v)">
                  <div class="face"> {{v.king|king}}</div>
                  <div class="topleft">{{v.value|cardNum}}</div>
                  <div class="bottomright">{{v.value|cardNum}}</div>
              </div>
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import _notify from "./notify";
import { Toast } from 'vant';
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      roomid: "",
      readyDisable: false,
      gameStarted:false,
      robDisable:false,
      isMeLandlord:false, //自己是否是地主
      startedBtnHidden:false, //隐藏开局前的准备等按钮
      sendCardFlag:false,  //出pai按钮是不被禁用 
      housemanageid:"", //房主
      currentrob:'',  //当前抢dz的人
      currentSendCard:'0',  //步骤条匹配当前执行动作的用户
      otherPlayer:[], //房间除自己外的人员  //上次出过的pai 是否是地主  是否准备  金币  isLandlord:false,sendCardFlag:false,prevCard:[]
      roomPlayer:[],//房间内所有人
      cardList:[], //当前的牌
      selectCard:[], //选中准备出的pai
      self_prevCard:[],  //上次自己出过的pai
      showKardList:[], //底pai
    };
  },
  filters:{
    king(val){
      if(val){
        if(val==14) return '小牛';
        if(val==15) return '大牛';
      }
      return ''
    },
    cardNum(val){
      let newVal;
      switch(val){
        case 1:newVal='3';break;
        case 2:newVal='4';break;
        case 3:newVal='5';break;
        case 4:newVal='6';break;
        case 5:newVal='7';break;
        case 6:newVal='8';break;
        case 7:newVal='9';break;
        case 8:newVal='10';break;
        case 9:newVal='J';break;
        case 10:newVal='Q';break;
        case 11:newVal='K';break;
        case 12:newVal='A';break;
        case 13:newVal='2';break;
      }
      return newVal;
    }
  },
  computed: {
    ...mapState(["socket", "uid"]),
    startDisable(){
      if(this.roomPlayer.length===3){
        return this.roomPlayer.every(item=>item.isready);
      }
      return false;
    }
  },
  created(){
    this.roomid = this.$route.params.id;
  },
  mounted() {
    this.getRoomInfo();
    this.socket.on("notify", (data) => {
      console.log(data);
      _notify(data);
      this.switchAction(data);
    });
  },
  beforeDestroy(){
    this.socket.removeAllListeners('notify');
  },
  methods: {
    ...mapMutations([""]),
    onClickLeft() {
      this.$router.go(-1);
    },
    //获取房间人员列表
    getRoomInfo(){
      this.socket.emit("notify", {
        cmd: "enterroom_req",
        data: {
          roomid: this.roomid,
        },
        callindex: 1,
      });
    },
    //根据响应匹配对应动作
    switchAction(action){
      const {type,data,result} = action;
      const {uid} = this;
      switch(type){
        case "enter_room_resp":{
            let {playerdata,housemanageid} = data;
            this.housemanageid = housemanageid;
            this.roomPlayer = playerdata;
            playerdata = playerdata.map(item=>{
              return{...item,isLandlord:false,sendCardFlag:false,prevCard:[],surplusCardLength:17};
            })
            const awaitOtherSort = playerdata.filter(item=>item.accountid !== uid );
            //界面转化逻辑位置
            if(data.seatindex == 2){
              this.otherPlayer = awaitOtherSort.sort((a,b)=>b.seatindex-a.seatindex);
            } else {
              this.otherPlayer = awaitOtherSort.sort((a,b)=>a.seatindex-b.seatindex);
            }
            const me = playerdata.find(item=>item.accountid==uid);
            this.readyDisable = me.isready;
          }
          break;
        case "player_joinroom_notify":
          this.getRoomInfo();
          break;
        case "player_ready_notify":{  //准备通知
            this.getRoomInfo();
          }
          break;
        case "gameStart_notify":{
            if(result==0){
              this.gameStarted =true;
            }
          }
          break;
        case "pushcard_notify":{  //发牌
            if(result ==0){
              console.log(data);
              let awaitBeautifyCardList  = data.map(item=>{
                return{
                  ...item,
                  active:false,
                }
              });
              this.beautifyCardList(awaitBeautifyCardList);
            }
          }break;
        case "canrob_notify":{  //通知谁可以抢
            if(data==this.uid){
              Toast.success('到你了');
              this.robDisable = true;
            } else {
              this.robDisable = false;
            }
            
          }break;
        case "change_master_notify":{  //指定地主
           const landlord = data;
           this.otherPlayer=this.otherPlayer.map(item=>{
             if(item.accountid===landlord){
               return {
                 ...item,
                 surplusCardLength:17+3,
                 isLandlord:true,
               }
             }
             return item;
           });

           if(this.uid === landlord){
             this.isMeLandlord =true;
           }
          }
          break;
        case "change_showcard_notify": { //显示底牌
          this.showKardList = data;
          let clone_showKardList = JSON.parse(JSON.stringify(data));
          clone_showKardList = clone_showKardList.map(item=>{
            return{...item,active:false}
          })
          this.startedBtnHidden = true;
          if(this.isMeLandlord){  //自己是地主
            //拼接底牌
            let awaitBeautifyCardList = this.cardList.concat(clone_showKardList);
            //--------------------------待排序
            this.beautifyCardList(awaitBeautifyCardList);
          }
        }
         break;
        case "can_chu_card_notify":{  //通知**可以出牌了
          const currentPlayer = this.roomPlayer.find(item=>item.accountid==data)
          this.currentSendCard = currentPlayer.seatindex - 1;
          if(this.uid ==data){
            Toast.success('到你了');
            this.sendCardFlag = true;
          } else {
            this.sendCardFlag = false;
            this.otherPlayer = this.otherPlayer.map(item=>{
              if(item.accountid===data){
                return{
                  ...item,
                  sendCardFlag:true,
                }
              } else {
                return item;
              }
            })
          }
        }
          
          break; 
        case "chu_card_res":{  //出pai响应
          if(result!=0){  //出pai失败 选中的pai归位
            Toast.fail(data.msg);
            this.cardList = this.cardList.map(item=>{
              return{
                ...item,
                active:false
              }
            })
            this.selectCard = [];
          } else {
            let clone_cartListCard = JSON.parse(JSON.stringify(this.cardList));  //克隆
            let awaitPushCard=[];  //准备放入上一次出过的pai数组4
            clone_cartListCard.forEach(item => {
              awaitPushCard.push(item)
            });
            //let awaitDelIndex=[]; //等待删除的数组的下标
  
            this.cardList = clone_cartListCard.filter(item=>!item.active);
       
            this.self_prevCard = JSON.parse(JSON.stringify(this.selectCard));
            console.log(this.self_prevCard);
            this.selectCard = [];
          }
        }break;
        case "other_chucard_notify":{//其他人出过的牌通知
            const {accountid,cards} = data;
            const findPlayer = this.otherPlayer.find(item=>item.accountid==accountid);
            if(findPlayer){
              findPlayer.prevCard = cards;
              findPlayer.surplusCardLength = findPlayer.surplusCardLength - cards.length
            } 
            
        }break;
        case "changehousemanage_notify":  //更换房主
          break;
      }
    },
    beautifyCardList(arr){
      let newArr = JSON.parse(JSON.stringify(arr));
      console.log('newArr',newArr);
      let kingList = newArr.filter(item=>item.king);
      console.log('kingList',kingList);
      let ortherCardList = newArr.filter(item=>!item.king)
      console.log('ortherCardList',ortherCardList);
      if(kingList.length==2){
        kingList.sort((a,b)=>b.king-a.king);
      }
      ortherCardList.sort((a,b)=>b.value-a.value);
      this.cardList = kingList.concat(ortherCardList);
    },
    activeCard(v){
      this.cardList = this.cardList.map(item=>{
        if(item.index){
          if(item.index == v.index){
            return {...item,active:!item.active}
          }
          return{...item};
        } else {  //大小🐂情况
          if(v.value==item.value){
             return {...item,active:!item.active}
          }
          return{...item};
        }
      })
      const awaitFilterActiveCard = this.cardList.filter(item=>item.active);
      this.selectCard = awaitFilterActiveCard.map(item=>{
        return{
          cardid:item.index,
          card_data:item,
        }
      })
      console.log(this.selectCard);
    },
    ready() {
      this.readyDisable = true;
      this.socket.emit("notify", {
        cmd: "player_ready_notify",
        data: {
          roomid: this.roomid,
        },
        callindex: 1,
      });
    },
    start(){
      this.socket.emit("notify", {
        cmd: "player_start_notify",
        data: {
          roomid: this.roomid,
        },
        callindex: 1,
      });
    },
    rob(type){  //抢 不抢
      this.socket.emit("notify", {
        cmd: "player_rob_notify",
        data: type==='rob'?1:0,
        callindex: 1,
      });
    },
    sendCard(type){
      let sendType;
      switch(type){
        case 'pass':
          sendType = 'chu_bu_card_req';
          break;
        case 'send':
          sendType = 'chu_card_req';
          break;
      }
      if(type=='chu_card_req'&&this.selectCard.length==0){
        Toast.fail('想什么呢？还没选牌呢！');
        return false;
      };
      this.socket.emit("notify", {
        cmd: sendType,
        data: this.selectCard.length?this.selectCard:0,
        callindex: 1,
      });
    }
  },
};
</script>

<style>
.room-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.room-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: #A8A8A8;
}
.van-col.high-col {
  height: 400px;
  background: pink;
}

/*底牌 */
.van-col.top-col{
  height: 110px;
}

/*别人出过的牌 */
.other_prevCard-box{
  position: relative;
  height: 75px;
}
/**自己出过的牌 */
.self_prevCard-box{
  position: relative;
  height: 75px;
}

/*剩下的牌 */
.pick-box{
    position: relative;
    height: 75px;
}

/**牌 */
.card{
    position: absolute;
    display: inline-block;
    left: 8em;
    /* top:-.7em;  选中后 */
    width: 3.875em;
    height: 5.5em;
    background-color: #fff;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    -webkit-box-shadow: 0 1px 1px rgb(0 0 0 / 15%);
    box-shadow: 0 1px 1px rgb(0 0 0 / 15%);
}
.card.active{
   top:-.7em;
}
.face{
    height: 100%;
    background-position: 50% 50%;
    -webkit-background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
.topleft,.bottomright{
    position: absolute;
    font-size: .7rem;
    text-align: center;
    line-height: 1;
    letter-spacing: -.1rem;
    font-family: 'Ubuntu Condensed',sans-serif;
    white-space: pre;
}
.topleft{
    top: .25em;
    left: .25em;
    -webkit-transform: translate(-50%,0);
    -moz-transform: translate(-50%,0);
    -o-transform: translate(-50%,0);
    -ms-transform: translate(-50%,0);
    transform: translate(-50%,0);
}
.bottomright{
    bottom: .25em;
    right: .25em;
    -webkit-transform: rotate(180deg) translate(-50%,0);
    -moz-transform: rotate(180deg) translate(-50%,0);
    -o-transform: rotate(180deg) translate(-50%,0);
    -ms-transform: rotate(180deg) translate(-50%,0);
    transform: rotate(180deg) translate(-50%,0);
}

/*头像 */
.avatar{
  width: 50px;
  height: 50px;
}
.avatar img{
  width: 100%;
  height: 100%;
}

/*地主 */
.landlord{
  display: flex;
  justify-content: flex-end;
}
</style>