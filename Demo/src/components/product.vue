<template>
    <div class = "goods">
      <el-input
        placeholder="I want to find ..."
        v-model="searchtarget"
        @keyup.enter.native="searchandsort"
        clearable>
      </el-input>
      <el-select v-model="attribute" clearable placeholder="Sort By">
        <el-option
          v-for="item in attributes"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="sortoption" clearable placeholder="Order">
        <el-option
          v-for="item in sortoptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="searchandsort">Search</el-button>
      <ul class="goods_continer">
        <li v-for="item in productlist.slice((currentpage-1)*pagesize,currentpage*pagesize)" :key="item.name">
          <el-card :body-style="{ padding: '0px' }" class = "card">
            <div class="bg">
              <el-carousel height="250px" :interval="10000" arrow="always">
                <el-carousel-item v-for="url in item.href" :key="url">
                  <img :src="url" width="250px" height="250px">
                </el-carousel-item>
              </el-carousel>
            </div>
            <div style="padding: 14px;">
              <router-link :to="'/product/' + item.key" class="btn btn-primary">{{item.title}}</router-link>
              <div class="clearfix bottom handle">
                <span>$ {{item.price}}</span>
              </div>
            </div>
          </el-card>
        </li>
       </ul>
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="8"
          layout="prev, pager, next"
          :total="countvalue">
        </el-pagination>
      </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'product',
  data: function () {
    return {
      sortoptions: [{
        value: 'Ascending',
        label: 'Ascending'
      }, {
        value: 'Descending',
        label: 'Descending'
      }],
      sortoption: '',
      attributes: [{
        value: 'price',
        label: 'Price'
      }, {
        value: 'amount',
        label: 'Amount'
      }],
      attribute: '',
      searchtarget: '',
      countvalue: 0,
      productlist: [],
      startpage: 1,
      currentpage: 1,
      pagesize: 8
    }
  },
  created () {
    this.getdata()
  },
  methods: {
    getdata () {
      const that = this
      var store = firebase.database().ref('Sell')
      store.on('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val().amount > 0) {
            var variable = {}
            var url = []
            variable.key = childSnapshot.key
            variable.currentindex = 0
            var pro
            for (pro in childSnapshot.val()) {
              if (pro === 'userID') {
                variable.userid = childSnapshot.val()[pro]
              } else if (pro === 'title') {
                variable.title = childSnapshot.val()[pro]
              } else if (pro === 'description') {
                variable.description = childSnapshot.val()[pro]
              } else if (pro === 'price') {
                variable.price = childSnapshot.val()[pro]
              } else if (pro !== 'comments' && pro !== 'sold' && pro !== 'amount' && pro !== 'uploadTime') {
                if (childSnapshot.val()[pro].highlight === 1) {
                  url.splice(0, 0, childSnapshot.val()[pro].imageURL)
                  variable.cover = childSnapshot.val()[pro].imageURL
                  variable.name = childSnapshot.val()[pro].name
                  variable.highlight = childSnapshot.val()[pro].highlight
                } else {
                  url.push(childSnapshot.val()[pro].imageURL)
                }
              }
            }
            variable.href = url
            that.productlist.push(variable)
          }
        })
      })
      that.countvalue = that.productlist.length
      // console.log(this.productlist)
    },
    searchandsort () {
      var sort = this.attribute
      var dirct = this.sortoption
      if (sort === '' && dirct === '') {
        sort = 'price'
        dirct = 'Ascending'
      }
      if (sort === '') {
        sort = 'price'
      }
      if (dirct === '') {
        if (sort === 'price') {
          dirct = 'Ascending'
        } else {
          dirct = 'Descending'
        }
      }
      const that = this
      that.productlist = []
      var store = firebase.database().ref('Sell')
      store.orderByChild(sort).once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val().title.toLowerCase().includes(that.searchtarget.toLowerCase()) && childSnapshot.val().amount > 0) {
            var variable = {}
            var url = []
            variable.key = childSnapshot.key
            variable.currentindex = 0
            var pro
            for (pro in childSnapshot.val()) {
              if (pro === 'userID') {
                variable.userid = childSnapshot.val()[pro]
              } else if (pro === 'title') {
                variable.title = childSnapshot.val()[pro]
              } else if (pro === 'description') {
                variable.description = childSnapshot.val()[pro]
              } else if (pro === 'price') {
                variable.price = childSnapshot.val()[pro]
              } else if (pro !== 'comments' && pro !== 'sold' && pro !== 'amount' && pro !== 'uploadTime') {
                if (childSnapshot.val()[pro].highlight === 1) {
                  url.splice(0, 0, childSnapshot.val()[pro].imageURL)
                  variable.cover = childSnapshot.val()[pro].imageURL
                  variable.name = childSnapshot.val()[pro].name
                  variable.highlight = childSnapshot.val()[pro].highlight
                } else {
                  url.push(childSnapshot.val()[pro].imageURL)
                }
              }
            }
            variable.href = url
            that.productlist.push(variable)
          }
        })
      })
      if (dirct === 'Descending') {
        that.productlist.reverse()
      }
      that.countvalue = that.productlist.length
    },
    handleCurrentChange (val) {
      this.currentpage = val
      console.log(this.currentpage)
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 400px;
  margin-left: 5px;
}
.el-select {
  width: 100px;
  margin-left: 30px;
}
.el-button {
  margin-left: 30px;
}
.goods{
  width: 100%;
  height: 100%;
  margin-left: 30px;
  margin-top: 50px;
}
.goods_continer{
  height: 100%;
  margin-top: 50px;
}
.goods li{
  list-style-type: none;
  float: left;
  width: 250px;
  height: 350px;
  margin-right: 30px;
  margin-bottom: 30px;
}
.card {
  padding: 0;
  width: 250px;
  height: 330px;
}
.goods .bg{
  float: left;
  width: 250px;
  height: 250px;
  margin-bottom: 15px;
}
.goods .info {
  float: left;
  margin-top: 30px;
  text-align: center;
  width: 400px;
  height: 30px;
}
.handle {
  margin-top: 10px;
}
.el-pagination {
  display: block;
  margin-left: 400px;
}
</style>
