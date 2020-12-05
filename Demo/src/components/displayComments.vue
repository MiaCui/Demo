<template>
    <div>
    <li v-for="item in commentlist.slice((currentpage-1)*pagesize,currentpage*pagesize)" :key="item.commentID">
        <v-flex md8 offset-sm3 class="text-center">
        <v-card
            elevation="2"
            outlined
            shaped
            >
              <v-layout col>
                <v-avatar>
                    <img src="https://cdn.vuetifyjs.com/images/john.jpg">
                </v-avatar>
              <v-card-subtitle> <h1>{{item.userName}}</h1> at {{toDate(item.commentTime)}}</v-card-subtitle>
              </v-layout>
              <v-card-text> {{item.commentContent}}</v-card-text>
              <v-col>
              <v-layout justify-center>
                <v-text-field
                :id="item.commentUUID"
                solo
                dense
                rounded
                clearable
                placeholder='Reply to comment ...'
                ></v-text-field>
                <v-btn
                @click="replyToComent(item.commentUUID)"
                >
                  Reply
                </v-btn>
              </v-layout>
              </v-col>
        </v-card>
        </v-flex>
    </li>
    <el-pagination
        @current-change="handleCurrentChange"
        :page-size="5"
        layout="prev, pager, next"
        :total="countvalue">
    </el-pagination>
    </div>
</template>

<script>
import firebase from 'firebase'
import * as fb from '../firebase'
export default {
  name: 'displayComments',
  data: function () {
    return {
      countvalue: 0,
      commentlist: [],
      startpage: 1,
      currentpage: 1,
      pagesize: 5
    }
  },
  props: {
    productID: {
      type: String,
      required: true
    }
  },
  created () {
    this.getdata()
  },
  methods: {
    async getUserName () {
      const userID = firebase.auth().currentUser.uid
      const name = await this.getName(userID)
      return name
    },
    async replyToComent (commentUUID) {
      const data = document.getElementById(commentUUID).value
      if (!data) {
        console.log('Data is None!')
      }
      // append comment to the message
      const message = 'Reply from ' + await this.getUserName() + ' at ' + 'Time:' + data
      console.log(message)
    },
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
    getdata () {
      const that = this
      var store = firebase.database().ref('Sell/' + that.productID + '/comments')
      store.on('value', function (snapshot) {
        var tempcommentlist = []
        that.countvalue = snapshot.numChildren()
        snapshot.forEach(function (childSnapshot) {
          var variable = {}
          variable.key = childSnapshot.key
          console.log(variable.key)
          var commentRef = firebase.database().ref('Comments/' + childSnapshot.key)
          variable.commentUUID = childSnapshot.key
          commentRef.once('value').then(async function (snapshot2) {
            variable.commentContent = snapshot2.val().commentContent
            variable.commentTime = snapshot2.val().commentTime
            variable.userID = snapshot2.val().userID
            variable.userName = await that.getName(variable.userID)
            tempcommentlist.push(variable)
            return snapshot2.val().userID
          })
        })
        that.commentlist = tempcommentlist
      })
      console.log(this.commentlist)
    },
    handleCurrentChange (val) {
      this.currentpage = val
      console.log(this.currentpage)
    }
  }
}
</script>
