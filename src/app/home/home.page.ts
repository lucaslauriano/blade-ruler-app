import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Loader } from '../../utils/loader/loader';
import { Message } from '../../utils/message/message';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    providers: [BluetoothSerial, Loader, Message]
})

export class HomePage implements OnInit {

    public shortcut = {
        newBlade: '',
        identifyBlade: '',
        inventoryBlade: '',
    };

    public connected: boolean = false;

    public tag: string;

    constructor(
        private loadingController: LoadingController,
        public bluetoothSerial: BluetoothSerial,
        public router: Router,
        private message: Message,
        public afAuth: AngularFireAuth) {

        this.shortcut.newBlade = '/new-blade';
        this.shortcut.identifyBlade = '/identify-blade';
        this.shortcut.inventoryBlade = '/inventory-blade';

    }

    ngOnInit() {
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

    public identifyBlade() {
        if (this.tag) {
            let id = this.tag
            this.router.navigate(['/identify',  id ]);
        } else {
            this.message.notify('Dispositivo não conectado!');
        }
    }

    public newBlade() {
        if (this.tag) {
            let id = this.tag
            this.router.navigate(['/new-blade']);
        } else {
            this.message.notify('Dispositivo não conectado!');
        }
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
        if (this.isConnected()) {
            this.router.navigate(['/inventory']);
        } else {
            this.message.notify('Dispositivo não conectado!');
        }
    }

}
