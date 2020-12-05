<template>

  <div>
    <el-menu router default-active="$router.path" class="el-menu-vertical-demo" :collapse="isCollapse">
      <el-menu-item index="/product">
        <i class="el-icon-menu"></i>
        <span slot="title">Store</span>
      </el-menu-item>
      <el-menu-item index="/addItem" v-show="isLogin">
        <i class="el-icon-document"></i>
        <span slot="title">Publish</span>
      </el-menu-item>
      <el-menu-item index = "/message" v-show="isLogin">
        <i class="el-icon-message-solid"></i>
        <span slot="title">Message</span>
      </el-menu-item>
      <el-menu-item index = "/cart" v-show="isLogin">
        <i class="el-icon-shopping-cart-1"></i>
        <span slot="title">Cart</span>
      </el-menu-item>
      <el-menu-item index = "/change" v-show="isLogin">
        <i class="el-icon-edit"></i>
        <span slot="title">Change</span>
      </el-menu-item>
      <el-menu-item index="/history"  v-show="isLogin">
        <i class="el-icon-date"></i>
        <span slot="title">History</span>
      </el-menu-item>
      <el-menu-item index="/login" v-show="!isLogin">
        <i class="el-icon-success"></i>
        <span slot="title">Login</span>
      </el-menu-item>
      <el-menu-item index="/register" v-show="!isLogin">
        <i class="el-icon-success"></i>
        <span slot="title">Register</span>
      </el-menu-item>
      <el-menu-item index="/setting" v-show="isLogin">
        <i class="el-icon-setting"></i>
        <span slot="title">Setting</span>
      </el-menu-item>
      <el-menu-item v-show="isLogin" >
        <i class = "el-icon-user-solid"></i>
        <span slot="title">{{show_user()}}{{username}}</span>
      </el-menu-item>
      <el-menu-item index="/" v-show="isLogin" @click="exit">
        <i class="el-icon-error"></i>
        <span slot="title">Logout</span>
      </el-menu-item>

    </el-menu>
  </div>
</template>

<script>
import * as cd from '../firebase'
import firebase from 'firebase'
export default {
  name: 'header',
  data: function () {
    return {
      username: '',
      isCollapse: false
    }
  },
  created () {
    this.$store.state.userProfile = window.sessionStorage.getItem('userProfile')
    this.$store.state.isLogin = window.sessionStorage.getItem('isLogin')
    window.addEventListener('beforeunload', () => {
      window.sessionStorage.setItem('userProfile', this.$store.state.userProfile)
      console.log(this.$store.state.isLogin)
      window.sessionStorage.setItem('isLogin', this.$store.state.isLogin)
    })
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
    check_user () {
      const user = firebase.auth().currentUser
      console.log(user)
    },
    exit () {
      this.$store.state.isLogin = false
      this.$store.dispatch('logout')
      console.log(this.$store.getters.getIsLogin)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    set_user () {
      this.username = this.show_user()
      console.log(this.show_user())
    },
    show_user () {
      const user = firebase.auth().currentUser
      if (user) {
        const that = this
        cd.usersCollection.doc(user.uid).get().then(function (doc) {
          if (doc.exists) {
            console.log(doc.data().name)
            that.username = doc.data().name
            return doc.data().name
          } else {
            return 'error'
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}
</style>
