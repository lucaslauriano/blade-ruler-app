import { Component, OnInit } from '@angular/core';
import { BladesService, Blades } from 'src/app/services/blades.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-identify',
    templateUrl: 'identify.page.html',
    styleUrls: ['identify.page.scss']
})
export class IdentifyPage implements OnInit {
    public blade: Blades = {
        _rfid: null,
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

    constructor(
        private bladesService: BladesService,
        private route: ActivatedRoute,
        public afs: AngularFirestore,
        private loadingController: LoadingController,
        private router: Router
    ) {
        this._id = this.route.snapshot.params['id'];
    }

    async loadBlade() {

        const loading = await this.loadingController.create({
            message: 'Carregando...',
            spinner: 'crescent',
            duration: 2000
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
