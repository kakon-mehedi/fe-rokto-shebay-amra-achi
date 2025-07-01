import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		loadChildren: () =>
			import('./home/home.module').then((m) => m.HomeModule),
	},
	{
		path: 'auth',
		loadChildren: () =>
			import('./auth/auth.module').then((m) => m.AuthModule),
		data: { title: 'প্রমাণীকরণ' },
	},
	{
		path: 'users',
		redirectTo: 'auth',
		pathMatch: 'full'
	},

	{
		path: 'dashboard',
		loadChildren: () =>
			import('./dashboard/dashboard.module').then(
				(m) => m.DashboardModule
			),
		data: { title: 'দাতা ড্যাশবোর্ড' },
	},
	{
		path: 'donors',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	},
	{
		path: 'donors/profile/edit',
		redirectTo: 'dashboard/profile/edit',
		pathMatch: 'full'
	},
	{
		path: 'donors/profile/change-password',
		redirectTo: 'dashboard/profile/change-password',
		pathMatch: 'full'
	},
	{
		path: 'emergency',
		loadChildren: () =>
			import('./emergency/emergency.module').then(
				(m) => m.EmergencyModule
			),
		data: { title: 'জরুরি রক্তের প্রয়োজন' },
	},
	{
		path: 'blood-donation-guide',
		loadChildren: () =>
			import('./blood-donation-guide/blood-donation-guide.module').then(
				(m) => m.BloodDonationGuideModule
			),
		data: { title: 'রক্তদান নির্দেশিকা' },
	},
	{
		path: 'about',
		loadChildren: () =>
			import('./about/about.module').then(
				(m) => m.AboutModule
			),
		data: { title: 'আমাদের সম্পর্কে' },
	},
	{
		path: 'donor-list',
		loadChildren: () =>
			import('./donor-list/donor-list.module').then(
				(m) => m.DonorListModule
			),
		data: { title: 'ডোনার তালিকা' },
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
