<template>
<div class="box">
  <div class="login_container">
    <div class="header">
      <H1>WeTrading</H1>
    </div>
    <div class="left">
      <p>WELCOME BACK</p>
    </div>
    <div class="right">
      <el-form :model = "loginForm" :rules = "rules" ref = "loginForm" label-width="80px" class="form">
        <el-form-item label="Type" prop="type">
          <el-select v-model="loginForm.type" placeholder="Please Choose the login Type">
            <el-option v-for="item in options" :key="item.value" :label="`${item.type}`" :value="item.type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label=loginForm.type prop="value">
          <el-input v-model="loginForm.value"></el-input>
        </el-form-item>
        <el-form-item label="PWD">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="button">
            <el-button type="primary" @click="login('loginForm')">LogIn</el-button>
          </span>
          <span class="href">
            <a href="#/empty">Forget Password</a>
          </span>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer"></div>
  </div>
</div>
</template>

<script>
export default {
  data: function () {
    return {
      loginForm: {
        type: '',
        value: '',
        password: ''
      },
      options: [
        {
          type: 'Email'
        },
        {
          type: 'Telephone'
        }
      ],
      rules: {
        type: [
          {
            required: true,
            message: 'Please Choose one of the option',
            trigger: 'blur'
          }
        ],
        value: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        password: [{
          required: true,
          trigger: 'blue'
        }]
      }
    }
  },
  methods: {
    login: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.loginForm.value)
          this.$store.dispatch('login', {
            type: this.loginForm.type,
            email: this.loginForm.value,
            password: this.loginForm.password
          })
          // this.$router.push('/home')
          // 补充 dispatch.....
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.box{
  width: 100%;
  height: 100%;
}
.login_container{
  background-color: #27434d;
  width: 600px;
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
.login_container .header{
  width: 100%;
  height: 100px;
  padding: 0;
  text-align: center;
}
.header h1{
  padding-top: 20px;
  color: white;
}
.login_container .left{
  width: 150px;
  height: 300px;
  float: left;
}
.login_container .left p{
  padding-top: 50px;
  padding-left: 10px;
  color: white;
}
.login_container .right{
  width: 450px;
  height: 300px;
  background-color: white;
  float: right;
  border-radius: 30px;
  padding-top: 50px;
  color: #27434d;
}
.login_container .right .form{
  width: 300px;
}
.button{
  width: 150px;
  padding: 10px;
}
.href{
  width: 150px;
  text-decoration: none;
}
</style>
