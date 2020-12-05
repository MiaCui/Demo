import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: 'AIzaSyACLDLNVtjsQSKKyHSFn8Sv4UR9ORBezpg',
  authDomain: 'wetrading-677a4.firebaseapp.com',
  databaseURL: 'https://wetrading-677a4.firebaseio.com',
  projectId: 'wetrading-677a4',
  storageBucket: 'wetrading-677a4.appspot.com',
  messagingSenderId: '1063911541301',
  appId: '1:1063911541301:web:52664553bb406328783f7c'
}
firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()

// collection references
const usersCollection = db.collection('users')

// export utils/refs
export {
  db,
  auth,
  usersCollection
}
