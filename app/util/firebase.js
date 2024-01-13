// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyBLeosF9uM4984ySbBv0ybxnVUHt5FcEeE",
	authDomain: "cxperts-portal.firebaseapp.com",
	projectId: "cxperts-portal",
	storageBucket: "cxperts-portal.appspot.com",
	messagingSenderId: "863662207839",
	appId: "1:863662207839:web:600c75ed4fae3440937cea",
	measurementId: "G-GCC5Z3G3YY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
