import { Component, OnInit, NgZone } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Loader } from '../../../utils/loader/loader';
import { Message } from '../../../utils/message/message';
import { R900Protocol } from 'src/utils/protocol/R900Protocol';
import { AlertController } from '@ionic/angular';

import {
    Blades,
    BladesService
} from 'src/app/services/blades.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-inventory',
    templateUrl: 'inventory.page.html',
    styleUrls: ['inventory.page.scss'],
    providers: [
        BluetoothSerial,
        Loader,
        Message
    ]
})

export class InventoryPage implements OnInit {

    public devices: Array<any> = [];
    public tags: Array<any> = [];
    public status: string = '';
    public blades: Array<any> = [];
    public storedTags: Blades[];
    public notFoundTags: Array<any> = [];
    public pageTitle: any;
    public totalBlades: any;
    public connected: boolean = false;
    public batteryLevel: String = '';
    public inventoring: boolean = false;
    public requester: String = '';

    constructor(
        private bluetoothSerial: BluetoothSerial,
        private bladesService: BladesService,
        private router: Router,
        private alertController: AlertController,
        private loader: Loader,
        private zone: NgZone,
        private message: Message
    ) {

        this.pageTitle = 'Facas';
    }

    ngOnInit() {

        this.bladesService.getBlades().subscribe(res => {
            this.storedTags = res;
            this.presentAlertPrompt()
        });

    }

    async presentAlertPrompt() {
        console.log('presentAlertPrompt')
        const alert = await this.alertController.create({
            header: 'Iventário Simulado',
            inputs: [
                {
                    name: 'tagsData',
                    type: 'text',
                    value: '',
                    placeholder: 'Tag Id'
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                        this.router.navigate(['/home']);
                    }
                }, {
                    text: 'Inventario',
                    handler: (data) => {
                        let inventoredTags = this.getInventoredTags(data.tagsData);

                        this.stored(inventoredTags)

                        this.compare(this.storedTags, inventoredTags);

                        console.log(this.blades);
                        console.log(this.notFoundTags);


                    }
                }
            ]
        });

        await alert.present();
    }

    remove(item) {
        this.bladesService.removeBlade(item.id);
    }

    stored(inventoredTags) {
        for (let i = 0; i < this.storedTags.length; i++) {
            let bladesStored = this.storedTags[i];

            for (let j = 0; j < inventoredTags.length; j++) {

                if (bladesStored.id === inventoredTags[j]) {
                    this.blades.push(bladesStored);
                }

            }
        }

    }

    compare(arr1, arr2) {

        if (!arr1 || !arr2) return

        let result = [];

        arr1.forEach((e1, i) => arr2.forEach(e2 => {

            if (e1.id != e2) {
                this.notFoundTags.push(e1);

            }

        })
        )
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

    parseInteger = array => {
        var newArray = [];

        for (let i = 0; i < array.length; i++) {
            newArray.push(parseInt(array[i]));
        }

        return newArray;
    };

    splited = (splited) => {
        return splited.split(',');
    };

    getInventoredTags = (data) => {
        var splited = data;
        var array = this.splited(splited);
        //  var newArray = this.parseInteger(array);
        return array;
    };


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

    public setConnection(status) {
        this.zone.run(() => {
            this.connected = false;
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

    public getInventory() {
        this.bluetoothSerial.write(R900Protocol.CMD_INVENT).then(
            data => {
                console.log('getInventory data', data)
                this.inventoring = true;
                this.setRequester('inventário');
                this.openInterface('stop', () => { });
            },
            err => {
                console.log('err', err);
            }
        )
    }

}
