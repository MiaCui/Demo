<template>
  <div class="show">
    <div class="title">
      <h1> Shopping History</h1>
    </div>
    <div class="te">
      <h1>Product</h1>
    </div>
    <div class="te">
      <h1>Amount</h1>
    </div>
    <div class="te">
      <h1>Photo</h1>
    </div>
    <div class="te">
      <h1>Price</h1>
    </div>
    <ul>
      <li v-for="(item,index) in data" :key="index + item.title">
        <div class="tem">
          <span>{{item.title}}</span>
        </div>
        <div class="tem">
          <span>{{item.amount}}</span>
        </div>
        <div class="tem">
          <img :src="item.cover" width="100px" height="100px">
        </div>
        <div class="tem">
          <span>{{item.sumprice}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'history',
  data: function () {
    return {
      userinfo: firebase.auth().currentUser.uid,
      data: []
    }
  },
  created () {
    this.getdata()
  },
  methods: {
    getdata () {
      if (!this.userinfo) {
        alert('Login First')
      }
      var that = this
      var store = firebase.database().ref('ShoppingHistory/' + this.userinfo)
      store.on('value', function (snapshot) {
        snapshot.forEach(function (childrensnapshot) {
          var productdetails = {}
          productdetails.key = childrensnapshot.key
          productdetails.amount = childrensnapshot.val().amount
          var db = firebase.database().ref('Sell/' + productdetails.key)
          db.on('value', function (dbshot) {
            dbshot.val()
            var pro
            for (pro in dbshot.val()) {
              if (dbshot.val()[pro].highlight === 1) {
                productdetails.cover = dbshot.val()[pro].imageURL
              }
            }
            productdetails.title = dbshot.val().title
            productdetails.sumprice = dbshot.val().price * productdetails.amount
          })
          that.data.push(productdetails)
        })
      })
    }
  }
}
</script>
<style scoped>
.show {
  width: 920px;
  height: 100%;
  margin: 0 auto;
  margin-top: 30px;
  text-align: center;
}
.title {
  margin-bottom: 30px;
  font-size: xx-large;
}
.te {
  width: 200px;
  height: 20px;
  margin-right: 30px;
  margin-bottom: 30px;
  line-height: 100%;
  text-align: center;
  float: left;
}
ul li{
  list-style: none;
}
li {
  margin: 0 auto;
}
.tem {
  width: 200px;
  height: 100px;
  margin-right: 30px;
  line-height: 100%;
  text-align: center;
  float: left;
}
span {
  display:inline-block;
  line-height: 100px;
}

</style>
