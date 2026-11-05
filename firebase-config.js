// Firebase project settings, shared by the Apex Lift app (app.js), Apex Coach (coach.js) and the admin page (admin.js).
// These values are not secret: every visitor's browser needs them to reach Firebase. What each account may read or
// write is decided by firestore.rules.
window.APEX_FIREBASE_CONFIG = Object.freeze({
    apiKey: 'AIzaSyCItVZimtbvod94CGUfYx1xwgSTW_mEq0Y',
    // On the live site, sign-in runs through our own address (Netlify passes /__/auth/ on to Firebase, see _redirects),
    // so Google's sign-in screen shows apex-liftt.netlify.app instead of the firebaseapp.com address
    authDomain: location.hostname === 'apex-liftt.netlify.app' ? location.host : 'apex-lift-52a18.firebaseapp.com',
    projectId: 'apex-lift-52a18',
    storageBucket: 'apex-lift-52a18.firebasestorage.app',
    messagingSenderId: '682655190858',
    appId: '1:682655190858:web:70d756fba8e17de80cbbb3'
});
