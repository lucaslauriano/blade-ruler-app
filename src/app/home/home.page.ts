import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Loader } from '../../utils/loader/loader';
import { Message } from '../../utils/message/message';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [BluetoothSerial, Loader, Message]
})

export class HomePage {

  public shortcut = {
    newBlade: '',
    identifyBlade: '',
    inventoryBlade: '',
  };

  constructor(
    private loadingController: LoadingController,
    public afAuth: AngularFireAuth) {

    this.shortcut.newBlade = '/new-blade';
    this.shortcut.identifyBlade = '/identify-blade';
    this.shortcut.inventoryBlade = '/inventory-blade';

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

}
