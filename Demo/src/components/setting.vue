<template>
  <div class="box">
    <div class="container">
      <div class = left>
        <ul>
          <li>
            User
          </li>
          <li>
            Info
          </li>
          <li>
            Settings
          </li>
        </ul>
      </div>
      <div class = right>
        <el-form  ref = "form" :model = "form" :rules="rules" label-width="50px" class="ruleForm">
          <el-form-item label="Username" label-width="100px" class="input1">
            <el-input  v-model="form.name" :placeholder="current.name" :disabled="nflag"></el-input>
          </el-form-item>
          <el-button type="primary" icon="el-icon-edit" circle @click="edit" class="button1"></el-button>
          <el-form-item label="Email" label-width="100px" class="input2">
            <el-input v-model="form.email" :placeholder="current.email" :disabled="eflag"></el-input>
          </el-form-item>
          <el-button type="primary" icon="el-icon-edit" circle @click="input" class="button2"></el-button>

        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import * as cd from '../firebase'
import firebase from 'firebase'
export default {
  name: 'setting',
  data: function () {
    return {
      form: {
        name: '',
        email: ''
      },
      nflag: true,
      eflag: true
    }
  },
  computed: {
    isLogin: function () {
      return this.$store.getters.getIsLogin
    },
    current: function () {
      return this.$store.getters.getCurrent
    }
  },
  methods: {
    edit () {
      if (!this.nflag) {
        const user = firebase.auth().currentUser
        if (user) {
          cd.usersCollection.doc(user.uid).update({ name: this.form.name })
          // this.$store.dispatch('logout')
        } else { console.log(0) }
      }
      this.nflag = !this.nflag
    },
    input () {
      if (!this.eflag) {
        const user = firebase.auth().currentUser
        if (user) {
          cd.usersCollection.doc(user.uid).update({ email: this.form.email })
          user.updateEmail(this.form.email).then(function () {

          }).catch(function (error) {
            console.log(error)
          })
        }
      }
      this.eflag = !this.eflag
    },
    show () {
      const user = firebase.auth().currentUser
      if (user) { console.log(user) } else { console.log(0) }
    },
    exit () {
      this.$store.dispatch('logout')
      console.log(this.$store.getters.getIsLogin)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped>
.box{
  width: 100%;
  height: 100%;
}
.container{
  background-color: #27434d;
  width: 700px;
  height: 500px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  border-radius: 20px;
  box-shadow: 0 4px 4px rgba(0,0,0,.4);
}
.container .left{
  width: 150px;
  height: 100%;
  float: left;
}
.container .left ul{
  padding-top: 50px;
  padding-left: 0;
}
.container .left ul li{
  list-style-type: none;
  font-family: "Helvetica Neue";
  font-size: xx-large;
  text-align: left;
  margin-left: 20px;
  color: honeydew;
  line-height: 50px;
}
.container .right{
  width: 500px;
  height: 100%;
  background-color: white;
  float: right;
}
.container .right .ruleForm{
  margin-left:0;
  width: 400px;
  padding-left: 30px;
  padding-top:30px;
}
.input1 {
  float: left;
}
.button1{
  float: right;
}
.input2 {
  float: left;
}
.button2{
  float: right;
}
</style>
