import { Component, OnInit } from '@angular/core';
import { Platform, NavController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Message } from 'src/utils/message/message';
import { BLE } from '@ionic-native/ble/ngx';
import { DataService } from './services/data.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    providers: [
        BluetoothSerial,
        Message,
        BLE
    ],
    inputs: [
        'connected'
    ]
})

export class AppComponent implements OnInit {

    public connected: boolean = false;

    public tag: string;
    public device;
    public message: string;

    constructor(
        public bluetoothSerial: BluetoothSerial,
        public router: Router,
        private platform: Platform,
        private data: DataService,
        //private message: Message,
        private splashScreen: SplashScreen,
        private loadingController: LoadingController,
        private statusBar: StatusBar,
        private afAuth: AngularFireAuth,
        private navigation: NavController
    ) {
        this.initializeApp();
    }

    ngOnInit() {
        this.data.currentMessage.subscribe(message => this.message = message)
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

    public identifyBlade() {

        if (this.connected) {
            let id = this.tag
            this.router.navigate(['/identify',  id ]);
        } else {
          //  this.message.notify('Dispositivo não conectado!');
        }
    }

    public newBlade() {
        if (this.connected) {
            this.router.navigate(['/new-blade']);
        } else {
           // this.message.notify('Dispositivo não conectado!');
        }
    }

    public inventory() {
        if (this.connected) {
            this.router.navigate(['/inventory']);
        } else {
           // this.message.notify('Dispositivo não conectado!');
        }
    }

}
