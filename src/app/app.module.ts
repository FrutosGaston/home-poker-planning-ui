import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlanningHomeComponent } from './modules/planning/pages/planning-home/planning-home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { TranslationComponent } from './util/translation/translation.component';
import { GuestLoginComponent } from './modules/planning/components/guest-login/guest-login.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { RoomComponent } from './modules/planning/pages/room/room.component';
import {RouterModule, Routes} from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {AbstractShapeComponent} from './util/abstract-shape/abstract-shape.component';
import {InjectableRxStompConfig, RxStompService, rxStompServiceFactory} from '@stomp/ng2-stompjs';
import {myRxStompConfig} from './my-rx-stomp.config';
import { CreateRoomComponent } from './modules/planning/components/create-room/create-room.component';
import { EstimationFormComponent } from './modules/planning/components/estimation-form/estimation-form.component';
import {MatSelectModule} from '@angular/material/select';
import { TaskListComponent } from './modules/planning/components/task-list/task-list.component';
import { DragScrollModule } from 'ngx-drag-scroll';
import { UserInRoomComponent } from './modules/planning/components/user-in-room/user-in-room.component';

const routes: Routes = [
  { path: '', component: PlanningHomeComponent },
  { path: 'room', component: RoomComponent },
  { path: 'room/:id', component: RoomComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    PlanningHomeComponent,
    TranslationComponent,
    GuestLoginComponent,
    RoomComponent,
    AbstractShapeComponent,
    CreateRoomComponent,
    EstimationFormComponent,
    TaskListComponent,
    UserInRoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    DragScrollModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient]
      }
    }),
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: InjectableRxStompConfig,
      useValue: myRxStompConfig,
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
