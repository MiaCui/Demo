<template>
  <article class="col-sm-12">
    <div class="detail">
      <div class="left">
        <el-carousel height="400px" :interval="10000" arrow="always">
          <el-carousel-item v-for="item in product" :key="item">
            <div class="small">
              <vue-photo-zoom-pro :url="item.href" :scale="3" :width="100"></vue-photo-zoom-pro>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="right">
        <h1> {{title}} </h1>
        <div class="userinfo">
          <div class="ID"> <p>Seller: {{userName}}</p></div>
          <div class="upload"><p>Posted at: {{toDate(uploadTime)}}</p></div>
        </div>
        <div class="description">
          {{description}}
        </div>
        <v-btn
          outlined
          rounded
          text
          @click="jump"
          :disabled="judge"
        >
          <p v-if="!judge">Add to Cart</p>
          <p v-if="judge">Temporarily Can't Purchase</p>
        </v-btn>
      </div>
    </div>
    <h2>Discussion</h2>
    <displayComment :productID='productID'></displayComment>
    <add-comment :userID='userID' :productID='productID' :sold="true"></add-comment>
  </article>
</template>

<script>
import firebase from 'firebase'
import addComment from './addComment.vue'
import displayComment from './displayComments.vue'
import * as fb from '../firebase'
export default {
  components: { addComment, displayComment },
  name: 'productdetail',
  data () {
    return {
      product: [],
      title: {},
      description: {},
      userID: {},
      userName: {},
      uploadTime: {},
      productID: {},
      currentUSer: '',
      info: '',
      amount: 0,
      sold: true,
      judge: true,
      slogan: ['Add to Cart', 'Out of Stock']
    }
  },
  created () {
    this.loaddata()
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
    loaddata () {
      this.info = this.$route.params.id
      const user = firebase.auth().currentUser.uid
      const that = this
      var store = firebase.database().ref('Sell/' + this.$route.params.id)
      that.productID = this.$route.params.id
      store.on('value', async function (snapshot) {
        that.title = snapshot.val().title
        that.description = snapshot.val().description
        that.userID = snapshot.val().userID
        that.userName = await that.getName(snapshot.val().userID)
        that.uploadTime = snapshot.val().uploadTime
        that.amount = snapshot.val().amount
        console.log(snapshot.val().amount, 'amount')
        that.sold = snapshot.val().sold
        var pro
        for (pro in snapshot.val()) {
          if (pro !== 'userID' && pro !== 'title' && pro !== 'uploadTime' && pro !== 'description' && pro !== 'sold' && pro !== 'price' && pro !== 'comments' && pro !== 'amount') {
            var variable = {}
            variable.name = snapshot.val()[pro].name
            variable.href = snapshot.val()[pro].imageURL
            that.product.push(variable)
          }
        }
        if (user === that.userID || that.amount === 0 || that.sold === true) {
          that.judge = true
        } else {
          that.judge = false
        }
      })
    },
    jump: function () {
      const user = firebase.auth().currentUser
      if (user) {
        this.currentUSer = user.uid
        var that = this
        var database = firebase.database().ref('Cart/')
        database.once('value').then(function (snapshot) {
          var children = snapshot.hasChild(that.currentUSer)
          if (children) {
            var grand = snapshot.child(that.currentUSer).hasChild(that.info)
            if (grand) {
              // number = snapshot.child(that.currentUSer).child(that.$route.params.id).val().amount
              var number = parseInt(snapshot.child(that.currentUSer).child(that.info).val().amount + 1)
              return { option: 0, val: number }
            } else if (grand === false) {
              return { option: 1, val: 0 }
            }
          } else {
            return { option: 1, val: 0 }
          }
        }).then(function (object) {
          console.log(object.option, object.val)
          if (object.option === 0) {
            // var number = parseInt(firebase.database().ref('Cart/' + that.currentUSer + '/' + that.$route.params.id).val().amount + 1)
            firebase.database().ref('Cart/' + that.currentUSer + '/' + that.$route.params.id).update({ amount: object.val })
          } else if (object.option === 1) {
            firebase.database().ref('Cart/' + that.currentUSer + '/' + that.$route.params.id).set({
              amount: 1
            })
          }
        })
        this.$message({
          showClose: true,
          message: 'Add to Cart',
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          message: 'Login First Please',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style scoped>
.detail {
  position: relative;
  width: 1000px;
  height: 500px;
  margin: 30px auto;
}
.left,.right{
  position: absolute;
  width: 50%;
}
.left {
  left: 0px;
  top: 0px;
}
.right{
  right: 0px;
  top: 0px;
  text-align: center;
}
h1 {
  font-size: 1.75rem;
  letter-spacing: 0;
  line-height: 2rem;
  color: inherit;
  font-weight: 700;
  text-transform: uppercase;
}
.userinfo {
  width: 75%;
  text-align: left;
  margin: 0 auto;
}
.ID,
.upload {
  height: 50px;
}
p {
  line-height: 20px;
  font-size: large;
  padding-top: 10px;
  border-bottom: 1px solid #888888;
}
.description {
  width: 75%;
  text-align: left;
  font-size: x-large;
  font-family: "Helvetica Neue";
  margin: 10px auto;
  padding-left: 20px;
}
ul li {
  float: left;
  margin-right: 50px;
}
.mx-auto {
  margin-top: 30px;
  margin-bottom: 30px;
}
h1 {
  font-size: x-large;
}
.title {
  font-size: x-large;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
</style>
