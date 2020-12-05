<template>
   <v-container>
       <h1>Message Center</h1>
       <br>
       <v-flex md8 offset-sm3 class="text-center">
       <div class = "messages">
        <ul class="messages_continer">
            <li v-for="item in messagelist.slice((currentpage-1)*pagesize,currentpage*pagesize)" :key="item.productID">
            <v-card
            elevation="2"
            outlined
            shaped
            >
              <v-card-title>Product: {{item.productName}}</v-card-title>
              <v-layout col>
                <v-avatar
                  color="teal"
                  size="48"
                >
                    <img
                        src="https://cdn.vuetifyjs.com/images/john.jpg"
                        alt="John"
                    >
                </v-avatar>
              <v-card-subtitle> <h1>{{item.userName}}</h1> at {{toDate(item.commentTime)}}</v-card-subtitle>
              </v-layout>
              <v-card-text> Comments: {{item.commentContent}}</v-card-text>
              <v-card-actions>
              <v-btn
                text
                color="teal accent-4"
                @click="detailedPage(item.productID)"
              >
              Read More
              </v-btn>
              <v-btn
                text
                color="teal accent-4"
                @click="deleteMessage(item.key)"
              >
                Delete
              </v-btn>
              </v-card-actions>
            </v-card>
            </li>
        </ul>
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="5"
          layout="prev, pager, next"
          :total="countvalue">
        </el-pagination>
      </div>
      </v-flex>
  </v-container>
</template>

<script>
import firebase from 'firebase'
import * as fb from '../firebase'
export default {
  name: 'message',
  data () {
    return {
      countvalue: 0,
      messagelist: [],
      startpage: 1,
      currentpage: 1,
      pagesize: 5,
      userID: firebase.auth().currentUser.uid
    }
  },
  created () {
    this.getdata()
  },
  methods: {
    toDate (num) {
      const date = new Date(num)
      return date.toLocaleTimeString() + ', ' + date.toDateString()
    },
    async getName (userID) {
      const userProfile = await fb.usersCollection.doc(userID).get()
      const data = await userProfile.data()
      console.log('Name: ' + data.name)
      return data.name
    },
    async getProductName (productID) {
      const store = firebase.database().ref('Sell/' + productID)
      let title = ''
      await store.once('value', async function (snapshot) {
        title = snapshot.val().title
      })
      return title
    },
    detailedPage (productID) {
      this.$router.push({ path: '/product/' + productID })
    },
    deleteMessage (key) {
      console.log('delete message, key=' + key)
      firebase.database().ref('Notifications/' + this.userID + '/' + key).remove()
      this.getdata()
    },
    getdata () {
      this.messagelist = []
      const that = this
      const ref = firebase.database().ref('Notifications/' + this.userID)
      ref.on('value', function (snapshot) {
        that.countvalue = 0
        console.log('num: ' + that.countvalue)
        snapshot.forEach(async function (childSnapshot) {
          if (childSnapshot.val().userID !== that.userID) {
            that.countvalue += 1
            that.messagelist.push({
              currentindex: 0,
              key: childSnapshot.key,
              type: childSnapshot.val().type,
              userID: childSnapshot.val().userID,
              userName: await that.getName(childSnapshot.val().userID),
              productName: await that.getProductName(childSnapshot.val().productID),
              productID: childSnapshot.val().productID,
              commentTime: childSnapshot.val().commentTime,
              commentContent: childSnapshot.val().commentContent
            })
          }
        })
      }, function (errorObject) {
        console.log('The read failed: ' + errorObject.code)
      })
    },
    handleCurrentChange (val) {
      this.currentpage = val
      console.log(this.currentpage)
    }
  }
}
</script>
