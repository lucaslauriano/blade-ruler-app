import { Component, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Loader } from '../../utils/loader/loader';
import { Message } from '../../utils/message/message';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Platform, LoadingController } from '@ionic/angular';
import { R900Protocol } from '../../utils/protocol/R900Protocol_'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [BluetoothSerial, Loader, Message]
})

export class HomePage {

  public devices: Array<any> = [];
  public tags: Array<any> = [];
  public status: string = '';
  public showBeep: boolean = false;
  public connected: boolean = false;
  public batteryLevel: String = '';
  public inventoring: boolean = false;
  public requester: String = '';

  public shortcut = {
    newBlade: '',
    identifyBlade: '',
    inventoryBlade: '',
  };

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private loadingController: LoadingController,
    private zone: NgZone,
    private loader: Loader,
    private message: Message,
    private platform: Platform,
    public afAuth: AngularFireAuth) {

    this.shortcut.newBlade = '/new-blade';
    this.shortcut.identifyBlade = '/identify-blade';
    this.shortcut.inventoryBlade = '/inventory-blade';

    if (this.platform.is('cordova')) {
        this.registerSubscribeData();
    }

  }

  public async identifyBlade() {
    
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

  public setStatus(status) {
    console.log('')
    this.status = status;
  }

  public setRequester(param) {
    console.log('')
    this.requester = param;
  }

  public clearRequester() {
    console.log('')
    this.requester = '';
  }

  public clearDevices() {
    console.log('')
    this.devices = [];
  }

  public scan() {
    this.bluetoothSerial.list().then(devicesFound => {
      this.devices = devicesFound;

    }, error => {
      console.log('error: ', error);
    });

  }

  public checkBluetothIsEnabled() {
    console.log('')
    this.bluetoothSerial.isEnabled().then(
      data => {
        console.log('bluethothStatus =>', data);
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  public handleConnection(item) {
    console.log('')
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

  public sendDislink() {
    console.log('sendDislink')
    this.bluetoothSerial.write(R900Protocol.CMD_DISLINK).then(
      data => {
        this.openInterface('Br.off', () => console.log('Br.off sucssess'));
        this.clearDevices();
        this.setConnection(false);
        this.sendDisconnectDeviceBluetooth();
        console.log('bluetoothDislink: ', data);
      },
      error => {
        console.log('error: ', error);
      }
    )
  }

  public sendDisconnectDeviceBluetooth() {
    console.log('sendDisconnectDeviceBluetooth')
    this.bluetoothSerial.disconnect().then(
      data => {
        this.openInterface('disconnect', () => console.log('disconnect'));
        this.clearDevices();
        this.setConnection(false);
        console.log('disconnect: ', data);
      },
      error => {
        console.log('error: ', error);
      }
    )
  }

  public turnOff() {
    console.log('turnOff')
    this.bluetoothSerial.write(R900Protocol.CMD_TURN_READER_OFF).then(
      data => {
        this.openInterface('Br.off', () => console.log('Br.off sucssess'));
        this.clearDevices();
      },
      error => {
        console.log(`There was an error: ${error}`);
      }
    );
  }

  public isConnected() {
    console.log('isConnected')
    this.bluetoothSerial.isConnected().then(
      status => {
        console.log('isConnected=> ', status);
      },
      err => {
        console.log('error on connect: ', err);
        if (err == 'error on connect:  Device connection was lost') this.setConnection(false);
      }
    )
  }

  public setConnection(status) {
    console.log('setConnection')
    this.zone.run(() => {
      this.connected = false;
    });
  }

  public getBatteryLevel() {
    console.log('getBatteryLevel')
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

  public toogleBeep(param) {
    console.log('toogleBeep')
    this.bluetoothSerial.write(`Br.beep, ${param ? 1 : 0}`).then(
      data => {
        console.log(`beep: ${param ? 'on' : 'off'}`);
        this.openInterface('Br.beep', () => {
          console.log('Br.beep sucssess')
          this.showBeep = param;
        });
      },
      err => {
        console.log('err ' + err);
      }
    )
  }

  public getVersion() {
    console.log('getVersion')
    try {
      let deviceVersion = this.bluetoothSerial.write(R900Protocol.CMD_GET_VERSION);
      console.log(`ver: ${deviceVersion}`);
      this.setRequester('versão');
      this.openInterface(R900Protocol.CMD_GET_VERSION, (version) => {
        console.log('Version');
      });
    } catch (error) {
      console.log('error', error);
    }
  }

  public getInventory() {
    console.log('getInventory')
    this.bluetoothSerial.write(R900Protocol.CMD_INVENT).then(
        data => {
            console.log('getInventory', data)
        this.inventoring = true;
        this.setRequester('inventário');
        this.openInterface('stop', () => { });
      },
      err => {
        console.log('err', err);
      }
    )
  }

  public stop() {
    console.log('stop')
    this.bluetoothSerial.write(R900Protocol.CMD_STOP).then(
      data => {
        console.log('stop', data);
        this.inventoring = false;
        this.openInterface('stop', () => { });
      },
      err => {
        console.log('err', err);
      }
    )
  }

  public parseTags(tags) {
    console.log('parseTags')
    let tagsSplited = tags.split('\r');

    let filteredTags = tagsSplited.filter((tag) => {
      let stringTag = new String(tag);
      return stringTag.startsWith('3') && stringTag.length == 32
    });

    filteredTags.forEach(element => {
      this.isIncluded(element.slice(22, 28), status => {

        console.log('isIncluded=> ' + element.slice(22, 28) + ' status=> ', status);
        /* 
                if (!status) {
                  this.getPatrimonyByTag(element.slice(22, 28), (data, err) => {
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
                  })
                } */
      })
    });
  }

  getPatrimonyByTag(tag: String, cb) {
    /*    this.patrimonyProvider.getByTag(tag).subscribe(
         data => {
           console.log(data);
           cb(data, null);
         },
         err => {
           console.log('error: ', err);
           cb(null, err);
         }
       ) */
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

  public clear() {
    this.tags = [];
  }

  public sendReader() {
    this.bluetoothSerial.write('s').then(
      data => {
        console.log('sendReader', data);
        this.bluetoothSerial.subscribeRawData().subscribe((data) => {
            console.log('subscribeRawData', data);
          this.bluetoothSerial.read().then((data) => {
            console.log('pure data : ', data)
            console.log('get invertory data : ' + JSON.stringify(data))
          });
        });
      },
      err => {
        console.log('err', err);
      }
    )
  }

}
