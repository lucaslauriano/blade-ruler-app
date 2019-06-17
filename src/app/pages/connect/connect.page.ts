
import { Component, NgZone, ChangeDetectorRef, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Loader } from '../../../utils/loader/loader';
import { Message } from 'src/utils/message/message';
import { Platform, NavController, LoadingController } from '@ionic/angular';
import { R900Protocol } from 'src/utils/protocol/R900Protocol';
import { DataService } from '../../services/data.service';
import { PopoverController } from '@ionic/angular';
//import { PopoverComponent } from '../../component/popover/popover.connect.component';

@Component({
    selector: 'app-connect',
    templateUrl: './connect.page.html',
    styleUrls: ['./connect.page.scss'],
    providers: [
        BluetoothSerial,
        Loader,
        Message
    ]
})
export class ConnectPage implements OnInit {

    public devices: Array<any> = [];
    public tags: Array<any> = [];
    public status: string = '';
    public message: string;
    public showBeep: boolean = false;
    public connected: boolean = false;
    public batteryLevel: String = '';
    public inventoring: boolean = false;
    public requester: String = '';

    constructor(
        private bluetoothSerial: BluetoothSerial,
        private zone: NgZone,
        public popoverController: PopoverController,
        private loader: Loader,
        private data: DataService,
       // private message: Message,
        private platform: Platform) {

        if (this.platform.is('cordova')) {
            this.registerSubscribeData();
        }

    }

    ngOnInit() {
        this.data.currentMessage.subscribe(message => this.message = message)
    }

    newMessage() {
        this.data.changeMessage("Hello from Sibling")
    }

    async presentPopover(ev: any) {
        const popover = await this.popoverController.create({
            component: PopoverConnectComponent,
            event: ev,
            translucent: true
        });
        return await popover.present();
    }

    public registerSubscribeData() {
        this.bluetoothSerial.subscribeRawData().subscribe((data) => {
            console.log('registerSubscribeData', data)
            this.bluetoothSerial.read().then((data) => {
                console.log('registerSubscribeData', data)
                if ((data.indexOf('online=0')) >= 0) {
                    this.setConnection(false);
                }

                if ((data.indexOf('CONNECT F0D7AA6993CE')) >= 0) {
                    this.setConnection(false);
                   // this.message.notify('Erro ao conectar, reinicie o device(DOTR-900) e tente novamente!');
                }

                this.parseTags(data);
                console.log('parseTags', data)
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
                console.log('paropenInterfaceseTags', status)
                cb(status)
            },
            err => {
                console.log('err', err);
            }
        )
    }

    public setStatus(status) {
        this.status = status;
    }

    public setRequester(param) {
        this.requester = param;
    }

    public clearRequester() {
        this.requester = '';
    }

    public clearDevices() {
        this.devices = [];
    }

    public scan() {
        this.bluetoothSerial.list().then(devicesFound => {
            this.devices = devicesFound;
        }, error => {
            //this.message.notify('Erro ao conectar, reinicie o dispositivo! ');
            console.log('error: ', error);
        });
    }

    public checkBluetothIsEnabled() {
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
        if (!item) {
            return;
        }
        this.bluetoothSerial.connect(item.address).subscribe(
            status => {
                cb(status);
            },
            err => {
               // this.message.notify('Erro ao conectar, reinicie o dispositivo!');
                console.log('Error on Connecting: ', err);
                this.setConnection(false);
            }
        )
    }

    public sendDislink() {
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
        this.zone.run(() => {
            this.connected = false;
        });
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

    public toogleBeep(param) {
        this.bluetoothSerial.write(`Br.beep,${param ? 1 : 0}`).then(
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
        try {
            let deviceVersion = this.bluetoothSerial.write(R900Protocol.CMD_GET_VERSION);
            console.log(`ver: ${deviceVersion}`);
            this.setRequester('versão');
            this.openInterface(R900Protocol.CMD_GET_VERSION, () => { });
        } catch (error) {
            console.log('error', error);
        }
    }

    public stop() {
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
        let tagsSplited = tags.split('\r');

        let filteredTags = tagsSplited.filter((tag) => {
            let stringTag = new String(tag);
            return stringTag.startsWith('3') && stringTag.length == 32
        });

        filteredTags.forEach(element => {
            this.isIncluded(element.slice(22, 28), status => {
                console.log('isIncluded=> ' + element.slice(22, 28) + ' status=> ', status);

                if (false) {

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

    public clear() {
        this.tags = [];
    }

    public sendReader() {
        this.bluetoothSerial.write('s').then(
            data => {
                console.log('sendReader', data);
                this.bluetoothSerial.subscribeRawData().subscribe((data) => {
                    console.log('subscribeRawData data : ', data)
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


