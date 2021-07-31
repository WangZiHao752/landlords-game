<template>
  <div class="beforeRoom-wrapper">
    <div class="form-wrapper">
      <div class="form-inner">
        <van-field
          v-model="roomid"
          name="roomid"
          label="房间号"
          :rules="[{ required: true, message: '请填写房间号' }]"
        >
          <template #button>
            <van-button size="small" type="primary" @click="joinRoom"
              >加入</van-button
            >
          </template>
        </van-field>
        <van-button  type="info" @click="createRoom">创建房间</van-button>
      </div>
    </div>
  </div>
</template>

<script>
//import _notify from "./notify.js";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      roomid: "",
    };
  },
  computed: {
    ...mapState(["socket", "uid"]),
  },
  methods: {
    ...mapMutations([""]),
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
  },
  mounted(){
    // this.socket.on("notify", (data) => {
    //   console.log(data);
    //   _notify(data);
    //   const {type} = data;
    //   if(type=='createroom_resp'){
    //     this.roomid = data.data.roomid
    //   }
    // });
  }
};
</script>

<style>
.beforeRoom-wrapper {
  width: 100%;
  height: 100%;
  background: #000;
  position: relative;
}
.form-wrapper {
  width: 85%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0px 0px 20px -7px #fff;
}
.form-inner {
  width: 350px;
}
</style>