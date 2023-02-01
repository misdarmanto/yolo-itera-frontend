import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC0RK0NMC3PHPV5l32wjsA03UPWvSz4QhM",
    authDomain: "project-itera.firebaseapp.com",
    projectId: "project-itera",
    storageBucket: "project-itera.appspot.com",
    messagingSenderId: "606900750184",
    appId: "1:606900750184:web:7116d2252067daf62478dd",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };
