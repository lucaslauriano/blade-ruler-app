import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Message } from 'src/utils/message/message';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

import {
    Blades,
    BladesService
} from 'src/app/services/blades.service';

@Component({
    selector: 'app-new-blade',
    templateUrl: 'new-blade.page.html',
    styleUrls: ['new-blade.page.scss'],
    providers: [
        BluetoothSerial,
        Message
    ],
})
export class NewBladePage implements OnInit {

    public pageTitle: any;
    public saveButtonTitle: any;
    public buttonColor: any;

    public connected: boolean = false;

    public blade: Blades = {
        categorie: null,
        img: null,
        montage: null,
        name: null,
        shape: null,
        status: null,
        storageLocation: null
    };

    public editingMode: boolean = false;

    public _id = null;
    endpoint = 'blades';

    constructor(
        private bladesService: BladesService,
        private route: ActivatedRoute,
        public router: Router,
        public message: Message,
        private loadingController: LoadingController,
        private navigation: NavController
    ) { }

    ngOnInit() {
        this._id = this.route.snapshot.params['id'];
        this.init()

    }

    async loadBlade() {

        const loading = await this.loadingController.create({
            message: 'Carregando...',
            spinner: 'crescent',
            duration: 4000
        });

        await loading.present();

        this.get(loading)
    }

    savingTag() {
        console.log('Serializando');

    }

    async saveBlade() {
        const loading = await this.loadingController.create({
            message: 'Salvando...',
            spinner: 'crescent',
            duration: 4000
        });

        await loading.present();

        if (this._id) {
            this.update(loading);
        } else {
            this.add(loading);
        }
    }

    init() {

        if (this._id) {
            this.loadBlade();
            this.loadTextUpdate();
            this.editingMode = true;
        } else {
            this.loadTextNew();
        }
    }

    locateBlade() {
        this.router.navigate(['/locate']);
    }

    loadTextNew() {
        this.pageTitle = 'Nova Faca';
        this.saveButtonTitle = 'Incluir';
        this.buttonColor = 'primary';
    }

    loadTextUpdate() {
        this.pageTitle = 'Editar Faca';
        this.saveButtonTitle = 'Salvar';
        this.buttonColor = 'success';
    }

    get(loading) {
        this.bladesService.getBlade(this._id).subscribe(res => {
            loading.dismiss();
            this.blade = res;
        });
    }

    add(loading) {
        this.blade.status =  'Desalocada';
        this.bladesService.addBlade(this.blade).then(() => {
            this.savingTag()
            loading.dismiss();
            this.navigation.navigateBack(this.endpoint);
        });
    }

    update(loading) {
        this.bladesService
            .updateBlade(this.blade, this._id)
            .then(() => {
                loading.dismiss();
                this.navigation.navigateBack(this.endpoint);
            });
    }

}
