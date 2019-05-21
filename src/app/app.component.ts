import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [BluetoothSerial]
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
      title: 'Categorias',
      url: '/categories',
      icon: 'list'

    }
  ];

  constructor(
    public bluetoothSerial: BluetoothSerial,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afAuth: AngularFireAuth,
    public router: Router,
    private navigation: NavController
  ) {
    console.log(this.afAuth);
    console.log(this.router);

    this.initializeApp();
  }

  logOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
      location.reload();

    })
  }

  navigate() {
    this.navigation.navigateBack('login');
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.bluetoothSerial.subscribeRawData().subscribe(
        data => {
          console.log('subscribeRawData', data);
        },
        err => {
          console.log('error subscribeRawData', err);
        }
      );
    });
  }
}
