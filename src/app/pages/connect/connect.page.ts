
import { Component, NgZone, ChangeDetectorRef, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Loader } from '../../../utils/loader/loader';
import { Message } from 'src/utils/message/message';
import { Platform, NavController, LoadingController } from '@ionic/angular';
import { R900Protocol } from 'src/utils/protocol/R900Protocol';
import { R900Status } from 'src/utils/protocol/R900Status';
import { DataService } from '../../services/data.service';
import { PopoverController } from '@ionic/angular';
import { ConnectConfigPopoverPage } from './connect-config-popover/connect-config-popover.page';

@Component({
    selector: 'app-connect',
    templateUrl: './connect.page.html',
    styleUrls: ['./connect.page.scss'],
    providers: [
        BluetoothSerial,
        Loader,
        DataService,
        Message
    ]
})
export class ConnectPage implements OnInit {

    public devices: Array<any> = [];
    public tags: Array<any> = [];
    public mSingleTag: boolean;
    public N_TYPE: number = 1;
    public mLastCmd: string = '';
    public status: string = '';
    public showBeep: boolean = false;
    public connected: boolean = false;
    public batteryLevel: String = '';
    public inventoring: boolean = false;
    public static NULL_1: Uint8Array = new Uint8Array([0x0d, 0x0a]);
    public static NULL_2: Uint8Array = new Uint8Array([0x0d]);
    public requester: String = '';

    constructor(
        private bluetoothSerial: BluetoothSerial,
        private zone: NgZone,
        public popoverController: PopoverController,
        private loader: Loader,
        private data: DataService,
        private message: Message,
        private platform: Platform) {

        if (this.platform.is('cordova')) {
            this.registerSubscribeData();
        }
        this.newMessage();

    }

    ngOnInit() {
        
    }


    newMessage() {
        this.data.changeMessage("Hello from Sibling")
    }

      async openPopover(ev: Event) {
         const popover = await this.popoverController.create({
             component: ConnectConfigPopoverPage,
             event: ev,
             translucent: true
         });
         return await popover.present();
     } 

     	//--- Access
	public sendSetSession(f_s: number, f_m: number, to: number) {

        R900Status.setOperationMode(1);
		this.sendData(R900Protocol.makeProtocol('Iparam', '1', [1, -1, -1]));
	}

    public sendData(data) {
        console.log('send dataaaaaaaa', data)
        if (this.connected) {
            this.bluetoothSerial.write(data);
        }
    }

    private sendCmdInventory(f_s: number, f_m: number, to: number) {
        this.sendSetSession(1,1,1);
        R900Status.setOperationMode(1);
        //this.mLastCmd = R900Protocol.CMD_INVENT;
        this.sendData(R900Protocol.makeProtocol('I', null, [f_s, f_m, to]));
    }

    public sendCmdSingleTag() {
        //this.mSingleTag 1 ou 0
        //this.mSingleTag 1 ou 0
        //this.mUseMask 3 ou 2  se nao 0
        this.sendCmdInventory(1, 3, 5000);
    }

    public static makeProtocol(cmd: string, option: string, param2: number[]): number[] {
        console.log('cmd', cmd)
        console.log('option', option)
        console.log('param2', param2)

        let protocol: {
            str: string,
            toString: Function
        } = {
            str: "", toString: function () { return this.str; }
        };
        (sb => { sb.str = sb.str.concat(<any>cmd); return sb; })(protocol);
        (sb => { sb.str = sb.str.concat(<any>","); return sb; })(protocol);

        if (option != null) (sb => { sb.str = sb.str.concat(<any>option); return sb; })(protocol);
        if (param2 != null && param2.length > 0) {
            for (let i: number = 0; i < param2.length; ++i) {
                {
                    (sb => { sb.str = sb.str.concat(<any>','); return sb; })(protocol);
                    if (param2[i] !== -1) (sb => { sb.str = sb.str.concat(<any>param2[i]); return sb; })(protocol);
                };
            }
        }
        return this.string2bytes(protocol.str);
    }

    public static getType() {
        if (1 == 1) {
            return this.NULL_1;
        }
        return this.NULL_2;
    }


    public static string2bytes(str: string): number[] {
        console.log('str', str)
        let charProtocol: string[] = (str).split('');
        console.log('charProtocol', charProtocol)
        let byteProtocol: number[] = (s => { let a = []; while (s-- > 0) a.push(0); return a; })(charProtocol.length + this.getTypeSize());
        console.log('dbyteProtocol', byteProtocol)
        let index: number = 0;
        for (let i: number = 0; i < charProtocol.length; ++i, ++index) {
            byteProtocol[index] = (<number>((c => c.charCodeAt == null ? <any>c : c.charCodeAt(0))(charProtocol[i]) & 255) | 0);
        }
        for (let i: number = 0; i < this.getTypeSize(); ++i, ++index) { byteProtocol[index] = this.getType()[i]; }
        console.log('byteProtocol', byteProtocol)
        return byteProtocol;
    }

    public static getTypeSize() {
        if (1 == 1)
            return 2;
        return 1;
    }

    public registerSubscribeData() {
        let tags;
        this.bluetoothSerial.subscribeRawData().subscribe((data) => {
            console.log('subscribeRawData', data)
            this.bluetoothSerial.read().then((data) => {
                tags = data;
                console.log('read', data)
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
                        this.batteryLevel = data.slice(6, 8);

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

        if (tags) {
            console.log('LUCAS', tags)

            this.bluetoothSerial.showBluetoothSettings().then((data) => {
                console.log('showBluetoothSettings', data)
            })
        }
    }

    public openInterface(log: String = '', cb) {
        this.bluetoothSerial.write(R900Protocol.OPEN_INTERFACE_1).then(
            status => {
                console.log('openInterface', status)
                cb(status)
            },
            err => {
                console.log('err', err);
            }
        )
    }

    public openInterface2(log: String = '', cb) {
        this.bluetoothSerial.write(R900Protocol.OPEN_INTERFACE_2).then(
            status => {
                console.log('openInterface', status)
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
            //console.log('error: ', error);
        });
    }

    public checkBluetothIsEnabled() {
        this.bluetoothSerial.isEnabled().then(
            data => {
                // console.log('bluethothStatus =>', data);
            },
            error => {
                //console.log('error: ', error);
            }
        );
    }

    public handleConnection(item) {
        if (!item) {
            return;
        }
        this.connect(item, (statusConnection) => {
            // console.log('statusConnection: ', statusConnection);
            if (statusConnection == 'OK') {
                this.openInterface('from handleConnection', (statusOpenInterface) => {
                    // console.log('statusOpenInterface: ', statusOpenInterface);
                    if (statusOpenInterface == 'OK') {
                        this.zone.run(() => {
                            this.connected = true;
                            this.clearDevices();
                        });
                        //this.getBatteryLevel();
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
                //console.log('bluetoothDislink: ', data);
            },
            error => {
                //console.log('error: ', error);
            }
        )
    }

    public sendDisconnectDeviceBluetooth() {
        this.bluetoothSerial.disconnect().then(
            data => {
                this.openInterface('disconnect', () => console.log('disconnect'));
                this.clearDevices();
                this.setConnection(false);
                //console.log('disconnect: ', data);
            },
            error => {
                //console.log('error: ', error);
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
                //  console.log(`There was an error: ${error}`);
            }
        );
    }

    public isConnected() {
        this.bluetoothSerial.isConnected().then(
            status => {
            },
            err => {
                if (err == 'error on connect:  Device connection was lost') this.setConnection(false);
            }
        )
    }

    public getInventory() {

        this.bluetoothSerial.write( [0x49] ).then(
            data => {
                console.log('R900Protocol.CMD_READ_TAG_MEM', R900Protocol.CMD_READ_TAG_MEM)
                console.log('getInventory data', data)
                this.inventoring = true;
                this.setRequester('inventário');
                this.openInterface('stop', () => { });
                this.stop();
            },
            err => {
                console.log('err', err);
            }
        )
    }

    public setConnection(status) {
        this.zone.run(() => {
            this.connected = false;
        });
    }


    public toogleBeep(param) {
        this.bluetoothSerial.write(`Br.beep,${param ? 1 : 0}`).then(
            data => {
                // console.log(`beep: ${param ? 'on' : 'off'}`);
                this.openInterface('Br.beep', () => {
                    this.showBeep = param;
                });
            },
            err => {
            }
        )
    }

    public getVersion() {
        try {
            let deviceVersion = this.bluetoothSerial.write(R900Protocol.CMD_GET_VERSION);
            //  console.log(`ver: ${deviceVersion}`);
            this.setRequester('versão');
            this.openInterface(R900Protocol.CMD_GET_VERSION, () => { });
        } catch (error) {
            // console.log('error', error);
        }
    }

    public stop() {
        this.bluetoothSerial.write(R900Protocol.CMD_STOP).then(
            data => {
                this.inventoring = false;
                this.openInterface('stop', () => { });
            },
            err => {
                //    console.log('err', err);
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
                console.log('sendReader data um', data);
                this.bluetoothSerial.subscribeRawData().subscribe((data) => {
                    console.log('subscribeRawData data : ', data)
                    this.bluetoothSerial.read().then((data) => {
                        console.log('pure data : ', data)
                        console.log('sendReader  data : ' + JSON.stringify(data))
                    });
                });
            },
            err => {
                console.log('err', err);
            }
        )
    }

}


