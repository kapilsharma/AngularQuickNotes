import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ManualComponent } from './manual/manual.component';
import { CliComponent } from './cli/cli.component';

@NgModule({
  declarations: [
    AppComponent,
    ManualComponent,
    CliComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
