import { Component, OnInit } from '@angular/core';

import {
  Blades,
  BladesService
} from 'src/app/services/blades.service';

@Component({
  selector: 'app-blades',
  templateUrl: 'blades.page.html',
  styleUrls: ['blades.page.scss']
})

export class BladesPage implements OnInit {
  public blades: Blades[];
  public pageTitle: any;

  constructor(private bladesService: BladesService) {
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

}
