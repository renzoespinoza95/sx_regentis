// src/services/firebase.js

import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCMDvd0UoLjDoqVpYZfpr6f2i9jcogVW1c",
  authDomain: "regentis-x.firebaseapp.com",
  projectId: "regentis-x",
  appId: "1:695115618751:web:38c740cc90bbe596cd290a"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider() 
