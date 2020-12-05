
<template>
  <div class="page-shopping-cart" id="shopping-cart">
    <div class="cart-title">
      <h3>Cart List</h3>
    </div>
    <div class="cart-product">
      <table>
        <tbody>
        <tr v-for="(item,index) in productlist" :key="index + item.key" v-show="item.amount">
          <td class="td-check fl"><el-checkbox v-model="item.check" :disabled="!item.status">Select</el-checkbox>
          </td>
          <td class="td-product fl"><img :src="item.cover" width="98" height="98">
          </td>
          <td class="td-do fl">
            <div class="ccdes">
              <p>Title: {{item.title}}</p>
              <p>Price: ${{item.price}}</p>
              <p>Stock: <span v-if="!item.status">Out Of Stock</span>
                <span v-if="item.status">{{item.stock}}</span>
              </p>
            </div>
          </td>
          <td class="td-num fl">
            <div>
              <el-input-number v-model="item.want" :min="1" :max="item.amount" label="description"></el-input-number>
            </div>
          </td>
          <td class="td-do fl"><el-button icon="el-icon-delete" round @click="jump(item.key)"></el-button></td>
        </tr>
        </tbody></table>
    </div>
    <div class="cart-product-info">
      <el-button class="btn-buy fr" round @click="buyitem3">CheckOut</el-button>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'cart',
  data: function () {
    return {
      content: 0,
      userinfo: firebase.auth().currentUser.uid,
      productlist: [],
      productbuy: [],
      sumprice: 0
    }
  },
  created () {
    this.getdata()
  },
  methods: {
    checkout () {
    },
    jump (key) {
      var store = firebase.database().ref('Cart/' + this.userinfo + '/' + key)
      store.remove()
      this.$router.replace({ path: '/empty' })
    },
    getdata () {
      this.productlist = []
      this.productbuy = []
      var that = this
      var store = firebase.database().ref('Cart/' + this.userinfo)
      store.on('value', function (snapshot) {
        snapshot.forEach(function (childrensnapshot) {
          var productdetails = {}
          productdetails.key = childrensnapshot.key
          productdetails.amount = childrensnapshot.val().amount
          productdetails.want = productdetails.amount
          productdetails.check = false
          var db = firebase.database().ref('Sell/' + productdetails.key)
          db.on('value', function (dbshot) {
            dbshot.val()
            productdetails.status = dbshot.val().sold !== true
            var pro
            for (pro in dbshot.val()) {
              if (dbshot.val()[pro].highlight === 1) {
                productdetails.cover = dbshot.val()[pro].imageURL
              }
            }
            productdetails.stock = dbshot.val().amount
            productdetails.description = dbshot.val().description
            productdetails.title = dbshot.val().title
            productdetails.price = dbshot.val().price
          })
          that.productlist.push(productdetails)
        })
      })
    },
    buyitem3 () {
      const that = this
      this.productlist.forEach(function (item) {
        if (item.check) {
          that.sumprice += item.price * item.want
        }
      })
      this.$confirm('Total Price is ' + this.sumprice, 'mention', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.buyitem2()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancel transaction'
        })
      })
    },
    buyitem2 () {
      const that = this
      var judge = true
      this.productlist.some(function (item) {
        if (item.check) {
          var fast = 0
          if (item.stock < item.want) {
            that.$message({
              message: item.title + ' is exceeds the product stock',
              type: 'warning'
            })
            fast = -1
          } else {
            var db = firebase.database().ref('Sell/' + item.key)
            db.on('value', function (dbshot) {
              // const that = this
              item.val = dbshot.val().amount
              that.productbuy.push(item)
            })
          }
        }
        if (fast === -1) {
          judge = false
          return true
        }
      })
      if (judge) {
        console.log(this.productbuy.length)
        this.buyitem1()
      }
    },
    addtohistory (item) {
      var database = firebase.database().ref('ShoppingHistory/')
      const that = this
      database.once('value').then(function (snapshot) {
        var children = snapshot.hasChild(that.userinfo)
        if (children) {
          var grand = snapshot.child(that.userinfo).hasChild(item.key)
          if (grand) {
            // number = snapshot.child(that.currentUSer).child(that.$route.params.id).val().amount
            var number = snapshot.child(that.userinfo).child(item.key).val().amount
            return { option: 0, val: number }
          } else {
            return { option: 1, val: 0 }
          }
        } else {
          return { option: 1, val: 0 }
        }
      })
        .then(function (object) {
          console.log('object', item.title)
          if (object.option === 0) {
            firebase.database().ref('ShoppingHistory/' + that.userinfo + '/' + item.key).update({ amount: item.want + object.val })
          } else if (object.option === 1) {
            firebase.database().ref('ShoppingHistory/' + that.userinfo + '/' + item.key).set({
              amount: item.want
            })
          }
        })
    },
    buyitem1 () {
      const that = this
      this.productbuy.forEach(function (item) {
        if ((item.val - item.want) === 0) {
          console.log('sold')
          firebase.database().ref('Sell/' + item.key).update({ sold: true })
        }
        firebase.database().ref('Sell/' + item.key).update({ amount: item.val - item.want })
        if (item.amount - item.want === 0) {
          console.log('remove')
          firebase.database().ref('Cart/' + that.userinfo + '/' + item.key).remove()
        } else {
          console.log('cart')
          firebase.database().ref('Cart/' + that.userinfo + '/' + item.key).update({ amount: item.amount - item.want })
        }
        that.addtohistory(item)
      })
      this.$message({
        type: 'success',
        message: 'Transaction complete!'
      })
      this.$router.replace({ path: '/empty' })
    }
  }
}
</script>

<style scoped>
.cart-title {
  max-height: 100vh;
  font-size: xx-large;
  color: white;
  background: linear-gradient(-90deg, #6a79cf, #1627c0);
  font-family: "Roboto", sans-serif;
  text-align: center;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.page-shopping-cart {
  width: 1000px;
  font-size: 14px;
  color: black;
  margin: 0 auto;
}
.page-shopping-cart .td-product .td-do{
  text-align: center;
  width: 200px; }
.page-shopping-cart .td-num{
  text-align: center;
  width: 250px; }
.cart-product .td-num{
  padding: 30px 80px;
}
.cart-product .td-check{
  padding: 40px 0px;
}
.cart-product .td-product{
  padding: 10px 60px;
}
.cart-product .td-do{
  padding-left: 50px;
  padding-top: 30px;
}
.page-shopping-cart .td-check {
  width: 50px; }
.page-shopping-cart .cart-product {
  padding: 0 20px; }
.page-shopping-cart .cart-product table {
  width: 100%;
  text-align: center;
  font-size: 14px; }
.page-shopping-cart .cart-product table tr {
  border-bottom: 1px black; }
.page-shopping-cart .cart-product table .td-product {
  text-align: left;
  font-size: 12px;
  line-height: 20px; }
.page-shopping-cart .cart-product-info {
  height: 50px;
  line-height: 50px;
  padding-left: 20px; }
.page-shopping-cart .cart-product-info .btn-buy {
  height: 50px;
  font-size: 20px;
  display: block;
  width: 200px;
  background: linear-gradient(-90deg, #6a79cf, #1627c0);
  color: #ffffff;
  text-align: center;
  margin-left: 30px; }
.page-shopping-cart{
  padding: 20px; }
.ccdes {
  width: 180px;
  height: 100%;
}
</style>
