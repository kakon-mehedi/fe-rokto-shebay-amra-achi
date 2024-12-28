import { NgModule } from '@angular/core';
import { RegisterDonorsComponent } from './components/register-donors/register-donors.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: RegisterDonorsComponent,
		data: {},
	},
];

@NgModule({
	declarations: [RegisterDonorsComponent],
	imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
	exports: [RegisterDonorsComponent],
    bootstrap: [RegisterDonorsComponent]
})
export class DonorsModule {}
