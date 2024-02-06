import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./home/home.module').then((m) => m.HomeModule),
	},
	{
		path: 'login',
		loadChildren: () =>
			import('./auth/auth.module').then((m) => m.AuthModule),
		//canActivate: [],
		data: {},
	},

	{
		path: 'dashboard',
		loadChildren: () =>
			import('./dashboard/dashboard.module').then(
				(m) => m.DashboardModule
			),
		//canActivate: [],
		data: {},
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
