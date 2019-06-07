import { Component, NgZone } from '@angular/core';
import { Platform, NavController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Loader } from '../utils/loader/loader';
import { Message } from '../utils/message/message';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { R900Protocol } from '../utils/protocol/R900Protocol';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [BluetoothSerial]
})

export class AppComponent {

  public devices: Array<any> = [];
  public tags: Array<any> = [];
  public status: string = '';
  public showBeep: boolean = false;
  public connected: boolean = false;
  public batteryLevel: String = '';
  public inventoring: boolean = false;
  public requester: String = '';

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home', 
      handler: () => {

      }
    },
    {
      title: 'Localizar',
      icon: 'barcode',
      handler: () => {
        this.locateBlade();
      }
    },
    {
      title: 'Identificar Faca',
      url: '/identify',
      icon: 'barcode',
      handler: () => {
        console.log('Identificar');
      }
    },
    {
      title: 'Facas',
      url: '/blades',
      icon: 'cut',
    },
    {
      title: 'Categorias',
      url: '/categories',
      icon: 'list',

    }
  ];

  customAlertOptions: any = {
    header: 'Dispositivos encontrados:',
    subHeader: '- Selecione -',
    message: '$1.00 per topping',
    translucent: true,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Okay',
        handler:  () => {
          console.log('Ok');
        }
      }
    ]
  };

  constructor(
    public bluetoothSerial: BluetoothSerial,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private loadingController: LoadingController,
    private zone: NgZone,
    private message: Message,
    private statusBar: StatusBar,
    private afAuth: AngularFireAuth,
    public router: Router,
    private navigation: NavController
  ) {

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

  async load(message) {
    const loading = await this.loadingController.create({
      message: message,
      spinner: 'crescent',
      duration: 2000
    });

    await loading.present();

    loading.dismiss();
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
  
 public locateBlade(){
    let message  = "Dispositivo não conectado!"
    console.log('locate');
    if(this.connected) {
    } else {
      this.load(message)
    }
 }

 public identifyBlade(){
    let message  = "Dispositivo não conectado!"
    console.log('locate');
    if(this.connected) {
    } else {
      this.load(message)
    }
 }

}
