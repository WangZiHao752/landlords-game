<template>
  <van-form @submit="onSubmit">
  <van-field
    v-model="uid"
    name="uid"
    label="用户名"
    placeholder="用户名"
    :rules="[{ required: true, message: '请填写用户名' }]"
  />
  <div style="margin: 16px;">
    <van-button round block type="info" native-type="submit">提交</van-button>
  </div>
</van-form>
</template>

<script>
import {mapMutations} from "vuex"
export default {
  data() {
    return {
      uid: '',
    };
  },
  methods: {
    ...mapMutations(['saveUid']),
    onSubmit(values) {
      console.log('submit', values);
      this.saveUid(this.uid)
      this.$router.push('/home')
    },
  },
};
</script>

<style>

</style>