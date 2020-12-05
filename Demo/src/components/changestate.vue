<template>
  <div>
    <table v-for="item in pro" :key="item.key">
      <tr>
        <th class="title1">Product Code</th>
        <th class="title1">Title</th>
        <th>Status</th>
        <th class="title1">Amount</th>
        <th class="title2">Description</th>
      </tr>
      <tr>
        <td>{{item.key}}</td>
        <td>
            <el-input
              type="text"
              v-model="item.title"
              :placeholder="item.title"
              maxlength ='20'>
            </el-input>
          <el-button type="primary" icon="el-icon-check" circle @click="changetitle(item)" class="button2"></el-button>
        </td>
        <td>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">{{item.sold}}<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleclick(true,item)">true</el-dropdown-item>
              <el-dropdown-item @click.native="handleclick(false,item)">false</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </td>
        <td>
          <el-input-number v-model="item.amount" controls-position="right" :placeholder="item.amount" :min="0">
          </el-input-number>
          <el-button type="primary" icon="el-icon-check" circle @click="changeamount(item)" class="button2"></el-button>
        </td>
        <td class="last">
          <textarea v-model = "item.description"></textarea>
          <el-button type="primary" icon="el-icon-edit" @click="modify(item)" class="des"></el-button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'changestate',
  data: function () {
    return {
      productlist: [],
      pro: [],
      title: '',
      userID: firebase.auth().currentUser.uid
    }
  },
  created () {
    this.getdata()
  },
  methods: {
    getdata () {
      var db = firebase.database().ref('Sell')
      const that = this
      db.on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val().userID === that.userID) {
            that.productlist.push(childSnapshot.key)
            var variable = {}
            variable.enable = true
            variable.key = childSnapshot.key
            variable.title = childSnapshot.val().title
            variable.description = childSnapshot.val().description
            variable.amount = childSnapshot.val().amount
            variable.sold = childSnapshot.val().sold
            console.log(childSnapshot.val().sold)
            variable.imagelist = []
            var pro
            for (pro in childSnapshot.val()) {
              if (pro !== 'userID' && pro !== 'title' && pro !== 'uploadTime' && pro !== 'description' && pro !== 'sold' && pro !== 'price' && pro !== 'comments' && pro !== 'amount') {
                var image = {}
                console.log(pro)
                image.key = pro
                image.name = childSnapshot.val()[pro].name
                image.url = childSnapshot.val()[pro].imageURL
                variable.imagelist.push(image)
              }
            }
            that.pro.push(variable)
          }
        })
      })
    },
    handleclick (status, item) {
      firebase.database().ref('Sell/' + item.key).update({ sold: status })
    },
    changetitle (item) {
      firebase.database().ref('Sell/' + item.key).update({ title: item.title })
    },
    changeamount (item) {
      firebase.database().ref('Sell/' + item.key).update({ amount: item.amount })
    },
    modify (item) {
      firebase.database().ref('Sell/' + item.key).update({ description: item.description })
    }
  }
}
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
table {
  width: 1200px;
  margin: 50px auto;
  border-top: 1px solid gray;
  border-left: 1px solid gray;
  border-spacing: 0;
}
th,td{
  text-align: center;
  height: 100px;
  border-bottom: 1px solid gray;
  border-right: 1px solid gray;
}
th{
  font-weight: bolder;
  font-size: x-large;
}

.title1 {
  width: 350px;
}
.title2{
  width: 450px;
}
.el-input {
  width: 200px;
  margin-right: 20px;
}
.el-input-number {
  width: 100px;
  margin-right: 20px;
}
td,th{
  width: 200px;
}
textarea{
  height: 100px;
  width: 250px;
  margin-left: -40px;
}
.last{
  position: relative;
}
.des{
  position: absolute;
  margin-left: 20px;
  right: 0;
  top: 35px;
}
</style>
