import { Component, OnInit, NgZone } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Loader } from '../../../utils/loader/loader';
import { Message } from '../../../utils/message/message';
import { R900Protocol } from 'src/utils/protocol/R900Protocol';

import {
  Blades,
  BladesService
} from 'src/app/services/blades.service';

@Component({
  selector: 'app-inventory',
  templateUrl: 'inventory.page.html',
  styleUrls: ['inventory.page.scss'],
  providers: [
    BluetoothSerial,
    Loader,
    Message
  ]
})

export class InventoryPage implements OnInit {

  public devices: Array<any> = [];
  public tags: Array<any> = [];
  public status: string = '';
  public blades: Blades[];
  public bladesModel: Blades[];
  public pageTitle: any;
  public connected: boolean = false;
  public batteryLevel: String = '';
  public inventoring: boolean = false;
  public requester: String = '';

  constructor(
    private bluetoothSerial: BluetoothSerial,
    private bladesService: BladesService,
    private R900Protocol: R900Protocol,
    private loader: Loader,
    private zone: NgZone,
    private message: Message
  ) {

    this.pageTitle = 'Facas';
  }

  ngOnInit() {
    this.bladesService.getBlades().subscribe(res => {
      this.blades = res;
    });
  }

  remove(item) {
    this.bladesService.removeBlade(item.id);
  }

  public isConnected() {
    this.bluetoothSerial.isConnected().then(
      status => {
        console.log('isConnected=> ', status);
      },
      err => {
        console.log('error on connect: ', err);
        if (err == 'error on connect:  Device connection was lost') this.setConnection(false);
      }
    )
  }

  public setStatus(status) {
    this.status = status;
  }

  public setRequester(param) {
    this.requester = param;
  }

  public clearRequester() {
    this.requester = '';
  }

  public clearDevices() {
    this.devices = [];
  }

  public setConnection(status) {
    this.zone.run(() => {
      this.connected = false;
    });
  }

  public openInterface(log: String = '', cb) {
    this.bluetoothSerial.write(R900Protocol.OPEN_INTERFACE_1).then(
      status => {
        console.log('paropenInterfaceseTags', status)
        cb(status)
      },
      err => {
        console.log('err', err);
      }
    )
  }

  public getInventory() {
    this.bluetoothSerial.write(R900Protocol.CMD_INVENT).then(
      data => {
        console.log('getInventory data', data)
        this.inventoring = true;
        this.setRequester('inventário');
        this.openInterface('stop', () => { });
      },
      err => {
        console.log('err', err);
      }
    )
  }

}
