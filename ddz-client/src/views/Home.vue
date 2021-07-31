<template>
  <div class="home">
    <!-- <div class="home-header">
      <van-field
        v-model="roomid"
        center
        clearable
        label="房间号"
        placeholder="请输入房间号"
      >
        <template #button>
          <van-button size="small" type="primary" @click="joinRoom"
            >加入</van-button
          >
        </template>
      </van-field>
      <van-button size="small" type="primary" @click="getRoomInfo"
            >获取房间内人员列表</van-button>
      <van-button size="small" type="info" @click="createRoom"
            >创建房间</van-button>
          <van-button size="small" type="primary" @click="playerReady"
            >准备</van-button>
            <van-button size="small" type="info" @click="playerStart"
            >开始</van-button>
            <van-button size="small" type="primary" @click="player_rob"
            >抢dz</van-button>
    </div> -->
    <div class="home-main">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState,mapMutations } from "vuex";
import _notify from "./notify";
export default {
  data() {
    return {
      roomid: "",
    };
  },
  created() {
    if(!this.socket){
      this.socketInit(require("socket.io-client")("http://localhost:8888"))
    }
  },
  computed: {
    ...mapState(["uid",'socket']),
  },
  mounted() {
    const { socket } = this;
    socket.on("connection", (data) => {
      console.log(data);
      //登录
      socket.emit("notify", {
        cmd: "wxlogin",
        data: {
          uniqueID: this.uid,
        },
        callindex: 1,
      });
    });

    socket.on("notify", (data) => {
      console.log(data);
      _notify(data);
      const {type} = data;
      if(type=='createroom_resp'){
        this.roomid = data.data.roomid
      }
    });
  },
  beforeDestroy(){
    this.socket.removeAllListeners('notify');
  },
  methods: {
    ...mapMutations(['socketInit']),
    //创建房间
    createRoom() {
      console.log("创建房间");
      this.socket.emit("notify", {
        cmd: "createroom_req",
        data: {
          rate: 4,
        },
        callindex: 1,
      });
    },
    //加入房间
    joinRoom() {
      this.socket.emit("notify", {
        cmd: "joinroom_req",
        data: {
          roomid: this.roomid,
        },
        callindex: 1,
      });
    },

    getRoomInfo(){
      this.socket.emit("notify", {
        cmd: "enterroom_req",
        data: {
          roomid: this.roomid,
        },
        callindex: 1,
      });
    },
    //准备
    playerReady(){
      this.socket.emit("notify", {
        cmd: "player_ready_notify",
        data: {
          roomid: this.roomid,
        },
        callindex: 1,
      });
    },
    //开始
    playerStart(){
      this.socket.emit("notify", {
        cmd: "player_start_notify",
        data: {
          roomid: this.roomid,
        },
        callindex: 1,
      });
    },
    //抢dz
    player_rob(){
      this.socket.emit("notify", {
        cmd: "player_rob_notify",
        data: {
          roomid: this.roomid,
        },
        callindex: 1,
      });
    },
  },
};
</script>
<style scoped>
.home{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.home-main{
  flex: 1;
}
</style>
