import { FirebaseError, initializeApp } from 'firebase/app'
import firebaseConfig from './firebaseconfig.json'
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth'
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  updateDoc,
  getDoc,
  doc,
} from 'firebase/firestore'
type ThermoSettings = {
  cmd: string
  lastTemp: string
  lastTime: string
  location: string
}
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()
const updateTemp = async (temp: number, user: User) => {
  console.log(temp, user.displayName, user.email)
  const q = query(
    collection(db, 'temp-setting'),
    where('email', '==', user.email)
  )
  const docs = await getDocs(q)
  if (docs.docs.length != 0) {
    const doc = docs.docs[0].ref
    await updateDoc(doc, { temp: temp.toString() })
  }
}
const getUserTemp = async (userMail: string | null): Promise<string> => {
  try {
    const q = query(
      collection(db, 'temp-setting'),
      where('email', '==', userMail)
    )
    const docs = await getDocs(q)
    if (docs.docs.length != 0) {
      const doc = docs.docs[0]
      return doc.data().temp
    }
  } catch (error) {
    console.log(error)
  }
  return '20'
}
const getThermostatSettings = async (): Promise<ThermoSettings | null> => {
  try {
    const q = doc(db, 'thermoCmd', 'thermostat1')
    const docData = await getDoc(q)
    return docData.data() as ThermoSettings
  } catch (err) {
    console.log(err)
  }
  return null
}
const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const res = await signInWithPopup(auth, googleProvider)
    const user = res.user
    const q = query(
      collection(db, 'allowed_emails'),
      where('email', '==', user.email)
    )
    // const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q)
    if (docs.docs.length === 0) {
      alert('Wrong place mothefucker')
      return null
    }
    return user
  } catch (err) {
    console.error(err)
    if (err instanceof FirebaseError) {
      alert(err.message)
    }
  }
  return null
}
const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (err) {
    console.error(err)
    if (err instanceof FirebaseError) {
      alert(err.message)
    }
  }
}

export {
  auth,
  updateTemp,
  getUserTemp,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  getThermostatSettings,
}
export type { ThermoSettings }
