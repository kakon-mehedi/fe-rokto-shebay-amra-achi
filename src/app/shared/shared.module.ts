import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MaterialModule } from './modules/material.module';



@NgModule({
  declarations: [
    NavigationComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    MatRippleModule,
    FlexLayoutModule
  ],
  exports: [
    MaterialModule,
    MatRippleModule,
    FlexLayoutModule,
    NavigationComponent,
    FooterComponent
  ]
})
export class SharedModule { }
