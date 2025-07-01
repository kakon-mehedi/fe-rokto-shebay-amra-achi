import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { MobileNavComponent } from './components/mobile-nav/mobile-nav.component';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { SocialChatHeadComponent } from './components/social-chat-head/social-chat-head.component';
import { AiChatAssistantComponent } from './components/ai-chat-assistant/ai-chat-assistant.component';
import { MaterialModule } from './modules/material.module';



@NgModule({
  declarations: [
    NavigationComponent,
    FooterComponent,
    MobileNavComponent,
    ScrollToTopComponent,
    SocialChatHeadComponent,
    AiChatAssistantComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    MatRippleModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    MaterialModule,
    MatRippleModule,
    FlexLayoutModule,
    NavigationComponent,
    FooterComponent,
    MobileNavComponent,
    ScrollToTopComponent,
    SocialChatHeadComponent,
    AiChatAssistantComponent,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
