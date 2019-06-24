import { Component, OnInit } from '@angular/core';
import { BladesService, Blades } from 'src/app/services/blades.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-identify',
    templateUrl: 'identify.page.html',
    styleUrls: ['identify.page.scss']
})
export class IdentifyPage implements OnInit {
    public blade: Blades = {
        categorie: null,
        img: null,
        montage: null,
        name: null,
        shape: null,
        status: null,
        storageLocation: null
    };
    private itemsCollection: AngularFirestoreCollection<any>;
    items: Observable<any[]>;
    countItems = 0;
    private _id = null;
    public totalBlades;
    public tag;
    public disabled: boolean = false;
    public endpoint = 'blades';;

    constructor(
        private bladesService: BladesService,
        private route: ActivatedRoute,
        public afs: AngularFirestore,
        public afAuth: AngularFireAuth,
        public alertController: AlertController,
        private loadingController: LoadingController,
        private navigation: NavController,
        private router: Router
    ) {
        this._id = this.route.snapshot.params['id'];
        console.log('currentUser:', afAuth.auth.currentUser);

        //displayName
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

    get(loading) {
        this.bladesService.getBlade(this._id).subscribe(res => {
            loading.dismiss();

            this.blade = res;
        });
    }

    async saveBlade(message) {
        const loading = await this.loadingController.create({
            message: message,
            spinner: 'crescent',
            duration: 4000
        });

        await loading.present();
        this.update(loading);
    }

    update(loading) {
        this.bladesService
            .updateBlade(this.blade, this._id)
            .then(() => {
                loading.dismiss();
                this.navigation.navigateBack(this.endpoint);
            });
    }

    lockedTag() {
        this.disabled !== this.disabled;
        if (this.blade.status === this.afAuth.auth.currentUser.displayName) {
            this.disabled = true;
            let message = 'Desalocando TAG...';
            this.blade.status = '';
            this.saveBlade(message);
        } else {
            if (!this.blade.status) {
                this.disabled = false;
                this.blade.status = this.afAuth.auth.currentUser.displayName;
                let message = 'Alocando TAG...';
                this.saveBlade(message);
            }
        }
    }

    ngOnInit() {
        if (this._id) {
            this.loadBlade()
        }
    }
    // add back when alpha.4 is out
    // navigate(item) {
    //   this.router.navigate(['/list', JSON.stringify(item)]);
    // }
}
