import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Identificar Faca',
      url: '/identify',
      icon: 'barcode'
    },
    {
      title: 'Facas',
      url: '/blades',
      icon: 'cut'
    },
    {
      title: 'Usuários',
      url: '/users',
      icon: 'contacts'
    },
    {
      title: 'Categorias',
      url: '/categories',
      icon: 'list'

    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public afAuth: AngularFireAuth,
    private navigation: NavController
  ) {
    this.initializeApp();
  }

  logOut() {
    this.afAuth.auth.signOut().then(() => {
      location.reload();
      this.navigate()

    })
  }

  navigate() {
    this.navigation.navigateBack('login');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
