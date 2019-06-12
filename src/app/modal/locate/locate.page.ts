import { Component, OnInit } from '@angular/core';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Platform } from '@ionic/angular';

@Component({
	selector: 'app-locate',
	templateUrl: './locate.page.html',
	styleUrls: ['./locate.page.scss'],
})
export class LocatePage implements OnInit {

	public rssi;
	public device;
	public foundDevices;
	 
	constructor(public bluetoothle: BluetoothLE, public plt: Platform) {

	}

	ngOnInit() {
		this.initializeBLE();
	}

	initializeBLE() {
		this.plt.ready().then((readySource) => {

			console.log('Platform ready from', readySource);

			this.bluetoothle.initialize().subscribe(ble => {
				console.log('ble', ble.status) // logs 'enabled'
			});
		});
	}

	startScan() {
		//this.bluetoothle.startScan(this.startScanSuccess, this.startScanError, this.device);
	}

	startScanSuccess(data) {
		this.rssi = data.rssi;
	}

	startScanError(error) {
		console.log(error);
	}

	connect(address) {

		console.log('Connecting to device: ' + address + "...", "status");

		if (cordova.platformId === "windows") {

		//	this.getDeviceServices(address);

		}
		else {

			this.stopScan();

			new Promise(function (resolve, reject) {

				this.bluetoothle.connect(resolve, reject, { address: address });

			}).then(this.connectSuccess, this.handleError);

		}
	}

	stopScan() {

		new Promise(function (resolve, reject) {

			this.bluetoothle.stopScan(resolve, reject);

		}).then(this.stopScanSuccess, this.handleError);
	}

	stopScanSuccess() {

		if (!this.foundDevices.length) {

			console.log("NO DEVICES FOUND");
		}
		else {

			console.log("Found " + this.foundDevices.length + " devices.", "status");
		}
	}

	connectSuccess(data) {
		console.log(data);
	}

	handleError(data) {
		console.log(data);
	}	

}
