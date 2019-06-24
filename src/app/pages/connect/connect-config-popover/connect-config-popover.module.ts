import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConnectConfigPopoverPage } from './connect-config-popover.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectConfigPopoverPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConnectConfigPopoverPage]
})
export class ConnectConfigPopoverPageModule {}
