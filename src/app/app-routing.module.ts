import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './shared/guards/admin.guard';

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
		path: 'admin',
		loadChildren: () =>
			import('./admin/admin.module').then((m) => m.AdminModule),
		data: { title: 'অ্যাডমিন প্যানেল' },
		canActivate: [AdminGuard]
	},
	{
		path: 'donor-list',
		loadChildren: () =>
			import('./donor-list/donor-list.module').then(
				(m) => m.DonorListModule
			),
		data: { title: 'ডোনার তালিকা' },
	},
	{
		path: 'legal',
		loadChildren: () =>
			import('./legal/legal.module').then(
				(m) => m.LegalModule
			),
		data: { title: 'আইনি তথ্য' },
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
