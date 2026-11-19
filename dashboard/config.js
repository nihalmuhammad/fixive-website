// Fixive test dashboard configuration.
// Firebase project: fixive-pilot. databaseURL assumes the Realtime Database is created in europe-west1 (Belgium).
// These values identify the project; they are not passwords. Access is controlled by the login and the database rules.
export const firebaseConfig = {
  apiKey: "AIzaSyDq2U7tn6lpYfNPUnmbQQK2VRNfHlZd6go",
  authDomain: "fixive-pilot.firebaseapp.com",
  databaseURL: "https://fixive-pilot-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fixive-pilot",
  appId: "1:935549369106:web:30cf55687ecc67d9c311cb",
};
export const LOGIN_EMAIL = "dashboard@fixivetech.com";   // pre-filled in the login form
export const CABINET_ALARM_C = 8;                         // cabinet temperature above this is flagged
export const OFFLINE_AFTER_S = 180;                       // no data for this long = offline
