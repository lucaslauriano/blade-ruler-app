import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';

import {
  Categories,
  CategoriesService
} from 'src/app/services/categories.service';

@Component({
  selector: 'app-new-categorie',
  templateUrl: 'new-categorie.page.html',
  styleUrls: ['new-categorie.page.scss']
})
export class NewCategoriePage implements OnInit {

  public pageTitle: any;
  public saveButtonTitle: any;
  public buttonColor: any;

  public categorie: Categories = { name: null, description: null };

  _id = null;
  endpoint = 'categories';

  constructor(
    private categoriesService: CategoriesService,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private navigation: NavController
  ) { }

  ngOnInit() {
    this._id = this.route.snapshot.params['id'];
    this.init()
  }

  async loadCategorie() {

    const loading = await this.loadingController.create({
      message: 'Carregando...',
      spinner: 'crescent',
      duration: 4000
    });

    await loading.present();

    this.get(loading)
  }

  async saveCategorie() {
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
      this.loadCategorie();
      this.loadTextUpdate();
    } else {
      this.loadTextNew();
    }
  }

  loadTextNew() {
    this.pageTitle = 'Nova Catedoria';
    this.saveButtonTitle = 'Incluir';
    this.buttonColor = 'primary';
  }

  loadTextUpdate() {
    this.pageTitle = 'Editar Catedoria';
    this.saveButtonTitle = 'Salvar';
    this.buttonColor = 'success';
  }

  get(loading) {
    this.categoriesService.getCategorie(this._id).subscribe(res => {
      loading.dismiss();
      this.categorie = res;
    });
  }

  add(loading) {
    this.categoriesService.addCategorie(this.categorie).then(() => {
      loading.dismiss();
      this.navigation.navigateBack(this.endpoint);
    });
  }

  update(loading) {
    this.categoriesService
      .updateCategorie(this.categorie, this._id)
      .then(() => {
        loading.dismiss();
        this.navigation.navigateBack(this.endpoint);
      });
  }

}
