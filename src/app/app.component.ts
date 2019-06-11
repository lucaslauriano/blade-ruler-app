import { Component, NgZone } from '@angular/core';
import { Platform, NavController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { R900Protocol } from 'src/utils/protocol/R900Protocol';
import { Message } from 'src/utils/message/message';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [
    BluetoothSerial, 
    Message
  ]
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
      title: 'Localizar',
      icon: 'barcode'
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

    },
    {
      title: 'Conectar',
      url: '/connect',
      icon: 'bluetooth',
    }
  ];

  customAlertOptions: any = {
    header: 'Dispositivos encontrados:',
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
        text: 'Conectar',
        handler: () => {
          console.log('Ok');
        }
      }
    ]
  };

  constructor(
    public bluetoothSerial: BluetoothSerial,
    private zone: NgZone,
    private platform: Platform,
    private message: Message,
    private splashScreen: SplashScreen,
    private loadingController: LoadingController,
    private statusBar: StatusBar,
    private afAuth: AngularFireAuth,
    public router: Router,
    private navigation: NavController
  ) {
    this.initializeApp();

    if (this.platform.is('cordova')) {
      this.registerSubscribeData();
    }
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
      duration: 50000
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

  public locateBlade() {
    let message = "Dispositivo não conectado!"
    console.log('locate');
    if (this.connected) {
    } else {
      this.load(message)
    }
  }

  public setConnection(status) {
    this.zone.run(() => {
      this.connected = false;
    });
  }

  public clearRequester() {
    this.requester = '';
  }

  public clearDevices() {
    this.devices = [];
  }

  public registerSubscribeData() {
    this.bluetoothSerial.subscribeRawData().subscribe((data) => {
      this.bluetoothSerial.read().then((data) => {

        console.log('registerSubscribeData data', data);

        if ((data.indexOf('online=0')) >= 0) {
          this.setConnection(false);
        }

        if ((data.indexOf('CONNECT F0D7AA6993CE')) >= 0) {
          this.setConnection(false);
          this.message.notify('Erro ao conectar, reinicie o device(DOTR-900) e tente novamente!');
        }

        this.parseTags(data);
        if (this.requester == 'battery') {
          this.zone.run(() => {
            // this.batteryLevel = data.slice(6, 8);
            let result = data.match(/\d+/g);
            if (result && result.length) {
              this.batteryLevel = result[0];
              console.log('batteryLevel', this.batteryLevel);
            }
            this.clearRequester();
          });
        }
      });
    });
  }

  public parseTags(tags) {
    let tagsSplited = tags.split('\r');

    let filteredTags = tagsSplited.filter((tag) => {
      let stringTag = new String(tag);
      return stringTag.startsWith('3') && stringTag.length == 32
    });

    filteredTags.forEach(element => {
      this.isIncluded(element.slice(22, 28), status => {
        console.log('isIncluded=> ' + element.slice(22, 28) + ' status=> ', status);

        if (!status) {
          /*  this.getBladeByTag(element.slice(22, 28), (data, err) => {
             if (err) {
               console.log('err', data)
             }
             if (data != null) {
               let tagObj = {
                 patrimony: data,
                 tag: element.slice(22, 28)
               };
               console.log('taaab=> ', tagObj);
               this.zone.run(() => {
                 console.log('oook');
                 this.tags.push(tagObj);
               });
             }
           }) */
        }
      })
    });
  }

  public isIncluded(element, cb) {
    let included = false;
    for (var i = 0; i < this.tags.length; i++) {
      if (this.tags[i].tag === element) {
        included = true;
        break;
      }
    }
    cb(included);
  }

  public connect(item, cb) {
    console.log('')
    if (!item) {
      return;
    }
    this.bluetoothSerial.connect(item.address).subscribe(
      status => {
        cb(status);
      },
      err => {
        this.message.notify('Error on Connecting, restart device!');
        console.log('Error on Connecting: ', err);
        this.setConnection(false);
      }
    )
  }

  public openInterface(log: String = '', cb) {
    this.bluetoothSerial.write(R900Protocol.OPEN_INTERFACE_1).then(
      status => {
        cb(status)
      },
      err => {
        console.log('err', err);
      }
    )
  }

  public handleConnection(item) {
    console.log('handleConnection', item);
    if (!item) {
      return;
    }
    this.connect(item, (statusConnection) => {
      console.log('statusConnection: ', statusConnection);
      if (statusConnection == 'OK') {
        this.openInterface('from handleConnection', (statusOpenInterface) => {
          console.log('statusOpenInterface: ', statusOpenInterface);
          if (statusOpenInterface == 'OK') {
            this.zone.run(() => {
              this.connected = true;
              this.clearDevices();
            });
            this.getBatteryLevel();
          }
        })
      }
    })
  
  }

  public setRequester(param) {
    this.requester = param;
  }

  public getBatteryLevel() {
    this.bluetoothSerial.write(R900Protocol.CMD_GET_BATT_LEVEL).then(
      data => {
        this.openInterface('Br.batt', () => console.log('Br.batt sucssess'));
        this.setRequester('battery');
      },
      error => {
        console.log(`There was an error: ${error}`);
      }
    );
  }

  public scan() {
    this.bluetoothSerial.list().then(devicesFound => {
      console.log('this.devices: ', devicesFound);
      return this.devices = devicesFound;

    }, error => {
      console.log('error: ', error);
    });

  }

  public identifyBlade() {
    console.log('locate');
    let message = "Identificanto Tag..."
    this.load(message).then(() => {
      if (this.connected) {
        let message = "Tag Encontrada..."
        this.load(message).then((data) => {
          console.log(data)
          this.router.navigate(['/new-blade']);
        })
      } else {
        let message = "Não Conectado!"
        this.load(message).then((data) => {
          console.log(data)
          this.router.navigate(['/new-blade']);
        })
      }
    })
  }

}
