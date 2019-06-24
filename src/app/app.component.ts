import { Component, OnInit } from '@angular/core';
import { Platform, NavController, LoadingController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Message } from 'src/utils/message/message';
import { BLE } from '@ionic-native/ble/ngx';

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

    public connected: boolean = true;

    public tag: string;
    public device;

    constructor(
        public bluetoothSerial: BluetoothSerial,
        public router: Router,
        private platform: Platform,
        private alertController: AlertController,
        private message: Message,
        private splashScreen: SplashScreen,
        private loadingController: LoadingController,
        private statusBar: StatusBar,
        private afAuth: AngularFireAuth,
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

    ngOnInit() {

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

    public identifyBlade(id) {
        this.router.navigate(['/identify',  id ]);
    }

    public newBlade() {
        if (this.connected) {
            this.router.navigate(['/new-blade']);
        } else {
            // this.message.notify('Dispositivo não conectado!');
        }
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
                        console.log('666',data);
                        this.identifyBlade(data.tag)
                    }
                }
            ]
        });

        await alert.present();
    }

    public inventory() {
        if (this.connected) {
            this.router.navigate(['/inventory']);
        } else {
            // this.message.notify('Dispositivo não conectado!');
        }
    }

}
