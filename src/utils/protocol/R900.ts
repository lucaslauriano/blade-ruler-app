import { R900Protocol } from '../../utils/protocol/R900Protocol';
import { R900Status } from '../../utils/protocol/R900Status';
import { Message } from '../../utils/message/message';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

export class R900 {

    public static MSG_REFRESH_LIST_TAG: number = 22;

    public mLastCmd: string;
    public mTimeout: number;
    public mUseMask: boolean;
    public mSingleTag: boolean;
    public mConnected: boolean;
    public mQuerySelected: boolean;
    
    constructor(
        private bluetoothSerial: BluetoothSerial,
        private message: Message,
        private mStrAccessErrMsg: string
    ) {
        if (this.mLastCmd === undefined) this.mLastCmd = null;
        if (this.mSingleTag === undefined) this.mSingleTag = false;
        if (this.mUseMask === undefined) this.mUseMask = false;
        if (this.mTimeout === undefined) this.mTimeout = 0;
        if (this.mQuerySelected === undefined) this.mQuerySelected = false;
        if (this.mStrAccessErrMsg === undefined) this.mStrAccessErrMsg = null;
        if (this.mConnected === undefined) this.mConnected = false;
    }

    public sendData(data) {
        if (this.mConnected === true) {
            this.bluetoothSerial.write(data);
        }
    }
    public sendCmdOpenInterface() {
        this.sendData(R900Protocol.OPEN_INTERFACE_1);
    }

    private sendCmdInventory(f_s: number, f_m: number, to: number) {
        R900Status.setOperationMode(1);
        this.mLastCmd = R900Protocol.CMD_INVENT;
        this.sendData(R900Protocol.makeProtocol(this.mLastCmd, null, [f_s, f_m, to]));
    }

    public sendCmdSingleTag() {
        this.sendCmdInventory(this.mSingleTag ? 1 : 0, this.mUseMask ? (this.mQuerySelected ? 3 : 2) : 0, this.mTimeout);
    }

    public registerSubscribeData(requester, zone, batteryLevel) {
        this.bluetoothSerial.subscribeRawData().subscribe((data) => {
            console.log('registerSubscribeData data', data);

            this.bluetoothSerial.read().then((data) => {

                console.log('read data', data);

                if ((data.indexOf('online=0')) >= 0) {
                    this.setConnection(false, null, null);
                }

                if ((data.indexOf('CONNECT F0D7AA6993CE')) >= 0) {
                    this.setConnection(false, null, null);
                    this.message.notify('Erro ao conectar, reinicie o device(DOTR-900) e tente novamente!');
                }

                this.parseTags(data);
                if (requester == 'battery') {
                    zone.run(() => {
                        batteryLevel = data.slice(6, 8);
                        let result = data.match(/\d+/g);
                        if (result && result.length) {
                            batteryLevel = result[0];
                            console.log('batteryLevel', batteryLevel);
                        }
                        this.clearRequester(requester);
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

    public setStatus(status, newStatus) {
        console.log('')
        newStatus = status;
    }

    public setRequester(param, requester) {
        console.log('setRequester param', param)
        requester = param;
    }

    public clearRequester(requester) {
        console.log('')
        requester = '';
    }

    public clearDevices(devices) {
        console.log('')
        devices = [];
    }

    public scan(devices) {
        this.bluetoothSerial.list().then(devicesFound => {
            return devices = devicesFound;

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

    public handleConnection(item, devices) {
        console.log('')
        if (!item) {
            return;
        }
        this.connect(item, (statusConnection, zone, connected) => {
            console.log('statusConnection: ', statusConnection);
            if (statusConnection == 'OK') {
                this.openInterface('from handleConnection', (statusOpenInterface) => {
                    console.log('statusOpenInterface: ', statusOpenInterface);
                    if (statusOpenInterface == 'OK') {
                        zone.run(() => {
                            connected = true;
                            this.clearDevices(devices);
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
                this.setConnection(false, null, null);
            }
        )
    }

    public sendDislink(devices) {
        console.log('sendDislink')
        this.bluetoothSerial.write(R900Protocol.CMD_DISLINK).then(
            data => {
                this.openInterface('Br.off', () => console.log('Br.off sucssess'));
                this.clearDevices(devices);
                this.setConnection(false, null, null);
                this.sendDisconnectDeviceBluetooth(devices);
                console.log('bluetoothDislink: ', data);
            },
            error => {
                console.log('error: ', error);
            }
        )
    }

    public sendDisconnectDeviceBluetooth(devices) {
        console.log('sendDisconnectDeviceBluetooth')
        this.bluetoothSerial.disconnect().then(
            data => {
                this.openInterface('disconnect', () => console.log('disconnect'));
                this.clearDevices(devices);
                this.setConnection(false, null, null);
                console.log('disconnect: ', data);
            },
            error => {
                console.log('error: ', error);
            }
        )
    }

    public turnOff(devices) {
        console.log('turnOff')
        this.bluetoothSerial.write(R900Protocol.CMD_TURN_READER_OFF).then(
            data => {
                this.openInterface('Br.off', () => console.log('Br.off sucssess', data));
                this.clearDevices(devices);
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
                if (err == 'error on connect:  Device connection was lost') this.setConnection(false, null, null);
            }
        )
    }

    public setConnection(status, zone, connected) {
        console.log('setConnection', status)
        zone.run(() => {
            connected = false;
        });
    }

    public getBatteryLevel() {
        console.log('getBatteryLevel')
        this.bluetoothSerial.write(R900Protocol.CMD_GET_BATT_LEVEL).then(
            data => {
                this.openInterface('Br.batt', () => console.log('Br.batt sucssess'));
                this.setRequester('battery', null);
            },
            error => {
                console.log(`There was an error: ${error}`);
            }
        );
    }

    public toogleBeep(param, showBeep) {
        console.log('toogleBeep')
        this.bluetoothSerial.write(`Br.beep, ${param ? 1 : 0}`).then(
            data => {
                console.log(`beep: ${param ? 'on' : 'off'}`);
                this.openInterface('Br.beep', () => {
                    console.log('Br.beep sucssess')
                    return showBeep = param;
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
            this.setRequester('versão', null);
            this.openInterface(R900Protocol.CMD_GET_VERSION, (version) => {
                console.log('Version', version);
            });
        } catch (error) {
            console.log('error', error);
        }
    }

    public getInventory(inventoring) {
        console.log('getInventory')
        this.bluetoothSerial.write(R900Protocol.CMD_INVENT).then(
            data => {
                console.log('data', data);
                inventoring = true;
                this.setRequester('inventário', null);
                this.openInterface('stop', () => { });
            },
            err => {
                console.log('err', err);
            }
        )
    }

    public stop(inventoring) {
        console.log('stop')
        this.bluetoothSerial.write(R900Protocol.CMD_STOP).then(
            data => {
                console.log('stop', data);
                inventoring = false;
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
                          this.getBladeByTag(element.slice(22, 28), (data, err) => {
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
            }, tags)
        });
    }

    public getBladeByTag(tag: String, cb) {
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

    public isIncluded(element, cb, tags) {
        let included = false;
        for (var i = 0; i < tags.length; i++) {
            if (tags[i].tag === element) {
                included = true;
                break;
            }
        }
        cb(included);
    }

    public clear(tags) {
        return tags = [];
    }

    public sendReader() {
        console.log('sendReade')
        this.bluetoothSerial.write('s').then(
            data => {
                console.log('s', data);
                this.bluetoothSerial.subscribeRawData().subscribe((data) => {
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