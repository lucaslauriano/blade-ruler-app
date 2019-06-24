import { Injectable } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';

@Injectable()
export class Loader {

    loadingController: LoadingController;

    constructor(
        public platform: Platform,
        public loading: LoadingController
    ) {
    }
    async show(message?: string) {
        ("object");
        if (this.loadingController) {
            ("tem loader");
            this.loadingController.dismiss();
            ("dismiss loader");
        }

        const loading = await this.loadingController.create({
            message: message,
            spinner: 'crescent',
            duration: 4000
        });
        ("loader criado");

        loading.present();
        ("show loader");

    }
    hide() {
        (this.loadingController);
        if (this.loadingController) {
            ("hide loader");
            this.loadingController.dismiss();
        }
    }
}