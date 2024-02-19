/* export default ({ app, router, store }) => {
    // Configurações específicas do boot do módulo de bebidas
    // ...
  
    // Expondo alguma funcionalidade a nível global
    app.config.globalProperties.$eventsBootFunction = () => {
      // ...
    };

    
  }; */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export default ({ app, router, store }) => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCz9BqC8ifgDOAxUclzK_zB4C-VYcxlTH8",
    authDomain: "tambula-4630a.firebaseapp.com",
    projectId: "tambula-4630a",
    storageBucket: "tambula-4630a.appspot.com",
    messagingSenderId: "642408221656",
    appId: "1:642408221656:web:04a573e9629cf4a0dd00ad",
  };

  // Initialize Firebase
  const appFirebase = initializeApp(firebaseConfig);

  // Expondo alguma funcionalidade a nível global
  app.config.globalProperties.$firebaseApp = appFirebase;
};
