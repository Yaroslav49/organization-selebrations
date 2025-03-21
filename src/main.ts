import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/shared/app.config';
import { AppComponent } from './app/shared/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) => 
   console.error(err)
);
