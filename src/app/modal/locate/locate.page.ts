import { Component, OnInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import  KalmanFilter from 'kalmanjs';

@Component({
    selector: 'app-locate',
    templateUrl: './locate.page.html',
    styleUrls: ['./locate.page.scss'],
    providers: [
    ]
})
export class LocatePage implements OnInit {

    public rssi;
    public device;
    public value = -200;
    public floatingValue;
    public foundDevices;

    constructor(
        public plt: Platform,
        public alertController: AlertController
    ) {


    }

    ngOnInit() {
        const kf = new KalmanFilter();
        this.floatingValue = kf.filter(this.value)
    }

     async presentAlertPrompt() {
        console.log('presentAlertPrompt')
        const alert = await this.alertController.create({
            header: 'Simulação: Localizar',
            inputs: [
                {
                    name: 'tag',
                    type: 'text',
                    value: '',
                    placeholder: 'Valor RSSI'
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        
                    }
                }, {
                    text: 'Localizar',
                    handler: (data) => {
                        const kf = new KalmanFilter();
                       this.value = data.tag;
                       console.log(this.value);
                       this.floatingValue = kf.filter(this.value);
                       console.log(this.floatingValue);
                    }
                }
            ]
        });

        await alert.present();
    }

    float2int (value) {
        return value | 0;
    }

}
