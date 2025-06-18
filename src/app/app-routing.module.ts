import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./home/home.module').then((m) => m.HomeModule),
	},
	{
		path: 'users',
		loadChildren: () =>
			import('./auth/auth.module').then((m) => m.AuthModule),
		//canActivate: [],
		data: {},
	},

	{
		path: 'donors',
		loadChildren: () =>
			import('./dashboard/dashboard.module').then(
				(m) => m.DashboardModule
			),
		//canActivate: [],
		data: {},
	},
	{
		path: 'emergency',
		loadChildren: () =>
			import('./emergency/emergency.module').then(
				(m) => m.EmergencyModule
			),
		data: {},
	},
	{
		path: 'blood-donation-guide',
		loadChildren: () =>
			import('./blood-donation-guide/blood-donation-guide.module').then(
				(m) => m.BloodDonationGuideModule
			),
		data: {},
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
