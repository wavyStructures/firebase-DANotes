import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"danotes-c3945","appId":"1:620707621608:web:223b82340eece0300cb75d","storageBucket":"danotes-c3945.appspot.com","apiKey":"AIzaSyDzpXGsSr63w8tJNasgqMW2867H6kHERpI","authDomain":"danotes-c3945.firebaseapp.com","messagingSenderId":"620707621608","measurementId":"G-NJPFCP22TK"})), provideFirestore(() => getFirestore())]
};
