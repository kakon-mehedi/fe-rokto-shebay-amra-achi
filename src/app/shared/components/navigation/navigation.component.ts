import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, OnInit } from '@angular/core';
import { Observable, map, shareReplay } from "rxjs";
import { NavigationService } from "../../services/navigation.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  isLoggedIn: any = false;
  isLoading: any = false;
  openNotificationPanel:boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private navigationService: NavigationService
  ) {}

  onSignOut() {
    
  }

  ngOnInit() {
    console.log('Navigation comp run')
  }

  toggleNotification(){
    this.openNotificationPanel = !this.openNotificationPanel;
  }

}
