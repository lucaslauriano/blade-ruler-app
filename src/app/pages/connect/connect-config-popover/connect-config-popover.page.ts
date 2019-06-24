import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { R900Protocol } from 'src/utils/protocol/R900Protocol';
import { R900 } from 'src/utils/protocol/R900';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-connect-config-popover',
    templateUrl: './connect-config-popover.page.html',
    styleUrls: ['./connect-config-popover.page.scss'],
    providers: [
        BluetoothSerial,
        HttpClientModule,
        HttpModule
    ]
})
export class ConnectConfigPopoverPage implements OnInit {

    constructor(
        private bluetoothSerial: BluetoothSerial
    ) {

    }

    ngOnInit() {
    }

    public getBatteryLevel() {

        console.log('bateria');
       
    }


}
