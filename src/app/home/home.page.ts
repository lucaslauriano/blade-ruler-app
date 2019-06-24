import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Loader } from '../../utils/loader/loader';
import { Message } from '../../utils/message/message';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    providers: [BluetoothSerial, Loader, Message, DataService]
})

export class HomePage implements OnInit {

    public shortcut = {
        newBlade: '',
        identifyBlade: '',
        inventoryBlade: '',
    };

    public connected: boolean = false;

    public tag: string;
    public messager: string;

    constructor(
        private loadingController: LoadingController,
        public bluetoothSerial: BluetoothSerial,
        public router: Router,
        public alertController: AlertController,
        private message: Message,
        private data: DataService,
        public afAuth: AngularFireAuth) {

        this.shortcut.newBlade = '/new-blade';
        this.shortcut.identifyBlade = '/identify-blade';
        this.shortcut.inventoryBlade = '/inventory-blade';

    }

    ngOnInit() {
        this.data.currentMessage.subscribe(message => this.messager = message)
        console.log(this.messager);
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
    async presentAlertPrompt() {
        console.log('presentAlertPrompt')
        const alert = await this.alertController.create({
            header: 'Simulação: Identificar',
            inputs: [
                {
                    name: 'tag',
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
                        this.router.navigate(['/home']);
                    }
                }, {
                    text: 'Identificar',
                    handler: (data) => {
                        this.identifyBlade(data.tag)
                    }
                }
            ]
        });

        await alert.present();
    }

    public identifyBlade(id) {
     
        this.router.navigate(['/identify', id]);
    }

    public newBlade() {
        this.router.navigate(['/new-blade']);
    }

    public isConnected() {
        this.bluetoothSerial.isConnected().then(
            status => {
                this.connected = true;
                console.log('isConnected=> ', status);

            },
            err => {
                console.log('error on connect: ', err);
            }
        )

        return this.connected;
    }

    public inventory() {
        this.router.navigate(['/inventory']);

    }

}
