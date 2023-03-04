# My PT Fire Alarm :fire::warning:

A sketch of a mobile app in Expo w/ React Native built to trigger an SMS or push notification when there is a forest fire nearby, leveraging the [fogos.pt](fogos.pt) API. If a forest fire is within a radius of specified KM based on lat/lng, the app will notify you a customized Whatsapp/SMS/Slack notification. 

## Tools

Expo/React Native/Firebase/Whatsapp API

## Firebase setup

To use Firebase as a backend for this app, you'll need to create a Firebase project and get the credentials. After registering your app, Firebase will provide you with a snippet of code that contains the firebaseConfig object that you need to use Firebase in your app.

Copy the firebaseConfig object and create a .env file in the root directory of your project. Add the following lines to the .env file:

```
FIREBASE_API_KEY=<your-api-key>
FIREBASE_AUTH_DOMAIN=<your-auth-domain>
FIREBASE_DATABASE_URL=<your-database-url>
FIREBASE_PROJECT_ID=<your-project-id>
FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
FIREBASE_MESSAGING_SENDER_ID=<your-messaging-sender-id>
FIREBASE_APP_ID=<your-app-id>
```