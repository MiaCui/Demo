<template>
   <v-container>
      <v-layout row>
        <v-flex md3 offset-sm3 class="text-center">
          <vue-upload-multiple-image
          @upload-success='uploadImageSuccess'
          @before-remove='beforeRemove'
          @edit-image='editImage'
          :data-images='images'
          :dragText='dragText'
          :idUpload='idUpload'
          :editUpload='editUpload'
          :browseText='browseText'
          :primaryText='primaryText'
          :markIsPrimaryText='markIsPrimaryText'
          :popupText='popupText'
          :dropText='dropText'
          ></vue-upload-multiple-image>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex md6 class="text-center">
          <v-row>
          <v-col cols="4">
            <v-text-field
              ref="title"
              clearable
              v-model="title"
              :rules="[
                () => !!title || 'This field is required',
                () => !!title && title.length <=20 || 'Title must be less than 20 characters'
              ]"
              placeholder="Title"
              counter=20
              required
            ></v-text-field>
          </v-col>
          </v-row>
        </v-flex>
      </v-layout>
      <br/>
      <v-layout row>
        <v-flex md4 class="text-center">
            <input v-model.number="price" required placeholder="Price" type="number">
        </v-flex>
        <v-flex md4 class="text-center">
            <input v-model.number="amount" required placeholder="Amount" type="number">
        </v-flex>
      </v-layout>
      <br>
      <v-layout row>
        <v-flex md4 class="text-center">
          <v-textarea
            label="Description"
            auto-grow
            outlined
            clearable
            rows="3"
            row-height="15"
            v-model="description"
            :rules="[
              () => !!description || 'This field is required',
              () => !!description && description.length <=200 || 'Description must be less than 200 characters'
            ]"
            counter=200
            required
          ></v-textarea>
        </v-flex>
      </v-layout>
      <br>
      <v-layout row>
        <v-flex md6 class="text-center">
          <v-btn
            :disabled="isDisabled"
            elevation="4"
            @click="upload"
          >upload</v-btn>
        </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
import VueUploadMultipleImage from 'vue-upload-multiple-image'
import firebase from 'firebase'
import * as fb from '../firebase'
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'addItem',
  components: {
    VueUploadMultipleImage
  },
  data () {
    return {
      images: [],
      dragText: 'Drag images or click',
      idUpload: 'idUpload',
      editUpload: 'editUpload',
      browseText: 'Click me',
      primaryText: 'Highlight',
      markIsPrimaryText: 'Mark as highlight',
      popupText: 'You can only highlight one photo',
      dropText: 'Drop here',
      productUUID: null,
      userID: firebase.auth().currentUser.uid,
      imgs: {},
      productInfo: {},
      title: '',
      description: '',
      amount: '',
      price: ''
    }
  },
  computed: {
    isDisabled: function () {
      return !this.title || !this.description || !this.amount || !this.price
    }
  },
  methods: {
    async upload () {
      this.productUUID = uuidv4()
      await firebase.database().ref('Sell/' + this.productUUID).set({})
      this.productInfo.userID = this.userID
      this.productInfo.title = this.title
      this.productInfo.description = this.description
      this.productInfo.sold = false
      this.productInfo.uploadTime = Date.now()
      this.productInfo.amount = this.amount
      this.productInfo.price = this.price
      for (const key in this.imgs) {
        const img = this.imgs[key]
        this.uploadImageData(img.name, img.data, this)
      }
      // add this product info into user profile
      const that = this
      await this.addProductToUser().then(function () {
        that.$router.push({ path: '/product/' + that.productUUID })
      })
    },
    async addProductToUser () {
      const userProfile = await fb.usersCollection.doc(this.userID).get()
      const data = userProfile.data()
      if ('sellList' in data) {
        const oldSellList = data.sellList
        await oldSellList.push(this.productUUID)
        await fb.usersCollection.doc(this.userID).update({
          sellList: oldSellList
        })
      } else {
        await fb.usersCollection.doc(this.userID).update({
          sellList: [this.productUUID]
        })
      }
    },
    uploadImageSuccess (formData, index, fileList) {
      const getUUID = require('uuid-by-string')
      const img = fileList[index]
      this.imgs[getUUID(img.name)] = {
        name: img.name,
        data: formData.get('file'),
        highlight: img.highlight
      }
      console.log('Selected', this.imgs[getUUID(img.name)])
    },
    uploadImageData (name, data, thisPtr) {
      console.log('Begin to upload', name)
      const uploadTask = firebase.storage().ref().child(this.productUUID + '/' + name).put(data)
      uploadTask.on('state_changed', function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
      }, function (error) {
        console.log(error)
      }, function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (imageURL) {
          const getUUID = require('uuid-by-string')
          const imgUUID = getUUID(name)
          console.log(name, 'available at', imageURL)
          thisPtr.productInfo[imgUUID] = {
            name: name,
            highlight: thisPtr.imgs[imgUUID].highlight,
            imageURL: imageURL
          }
          console.log(thisPtr.productInfo)
          firebase.database().ref('Sell/' + thisPtr.productUUID).update(thisPtr.productInfo)
        })
      })
    },
    beforeRemove (index, done, fileList) {
      console.log('index', index, fileList)
      const r = confirm('Remove image')
      if (r === true) {
        done()
      }
    },
    editImage (formData, index, fileList) {
      console.log('edit data', formData, index, fileList)
    }
  }
}
</script>

<style scoped>
#my-strictly-unique-vue-upload-multiple-image {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
