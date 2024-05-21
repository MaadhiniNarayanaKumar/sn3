import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { CustomerLandingComponent } from './components/customer-landing/customer-landing.component';
import { CusotmerHeaderComponent } from './components/cusotmer-header/cusotmer-header.component';
import { PlaygroundHeaderComponent } from './components/playground-header/playground-header.component';
import { EnterpriseExpertComponent } from './components/enterprise-expert/enterprise-expert.component';
import { ECommerceRecommendationComponent } from './components/ecommerce/ecommerce-recommendation/ecommerce-recommendation.component';
import { AudioAnalyticsComponent } from './components/audio-analytics/audio-analytics.component';
import { ImageProcessingComponent } from './components/image-processing/image-processing.component';
import { VideoAnalyticsComponent } from './components/video-analytics/video-analytics.component';
import { CodeGenerationComponent } from './components/code-generation/code-generation.component';
import { EcommerceMainComponent } from './components/ecommerce/ecommerce-main/ecommerce-main.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EcommerceLoadDatasetComponent } from './components/ecommerce/ecommerce-load-dataset/ecommerce-load-dataset.component';


@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    PlaygroundComponent,
    HomepageComponent,
    CustomerLandingComponent,
    CusotmerHeaderComponent,
    PlaygroundHeaderComponent,
    EnterpriseExpertComponent,
    ECommerceRecommendationComponent,
    AudioAnalyticsComponent,
    ImageProcessingComponent,
    VideoAnalyticsComponent,
    CodeGenerationComponent,
    EcommerceMainComponent,
    EcommerceLoadDatasetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
