import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class Message {
    constructor(private toastController: ToastController) { }

    async notify(text?: string, time?: number, position?: string) {
        let timeParam = time || 2000;
        let toast = await this.toastController.create({
            message: text,
            position: 'top',
            duration: timeParam
        });

        toast.present();
    }

}