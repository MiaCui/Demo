import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userProfile: {},
    isLogin: false
  },
  getters: {
    getIsLogin: state => state.isLogin,
    getCurrent: state => state.userProfile
  },
  mutations: {
    setUserProfile (state, val) {
      if (Object.keys(val).length > 0) {
        state.userProfile = val
        state.isLogin = true
      } else {
        state.userProfile = val
        state.isLogin = false
      }
    }
  },
  actions: {
    async logout ({ commit }) {
      try {
        await fb.auth.signOut()
        commit('setUserProfile', {})
        // signed out
      } catch (e) {
        console.log(e)
        // an error
      }
    },
    async login ({ dispatch }, form) {
      // sign user in
      const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)

      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },
    async signup ({ dispatch }, form) {
      // sign user up
      const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)

      // create user profile object in userCollections
      await fb.usersCollection.doc(user.uid).set({
        name: form.name,
        email: form.email,
        password: form.password,
        region: form.region,
        telephone: form.telephone,
        type: form.type
      })

      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },
    async fetchUserProfile ({ commit }, user) {
      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get()

      // set user profile in state
      commit('setUserProfile', userProfile.data())

      // change route to dashboard
      router.push('/home')
    }
  }
})
