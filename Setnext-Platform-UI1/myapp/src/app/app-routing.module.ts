import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent} from './components/signup/signup.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import { AppComponent } from './app.component';
import { CustomerLandingComponent } from './components/customer-landing/customer-landing.component';
import { EnterpriseExpertComponent } from './components/enterprise-expert/enterprise-expert.component';
import { CodeGenerationComponent } from './components/code-generation/code-generation.component';
import { ImageProcessingComponent } from './components/image-processing/image-processing.component';
import { VideoAnalyticsComponent } from './components/video-analytics/video-analytics.component';
import { AudioAnalyticsComponent } from './components/audio-analytics/audio-analytics.component';
import { ECommerceRecommendationComponent } from './components/ecommerce/ecommerce-recommendation/ecommerce-recommendation.component';
import { EcommerceMainComponent } from './components/ecommerce/ecommerce-main/ecommerce-main.component';
import { EcommerceLoadDatasetComponent } from './components/ecommerce/ecommerce-load-dataset/ecommerce-load-dataset.component';


const routes: Routes = [

  // { path: '', redirectTo: '/login', pathMatch: 'full'  },
  { path: '', component: CustomerLandingComponent },

  {path: 'signup', component: SignupComponent},

  {path: 'login', component: LoginComponent},

  {path: 'playground', component: PlaygroundComponent},

  {path: 'playground/enterprise-expert', component: EnterpriseExpertComponent},

  {path: 'playground/code-generation', component: CodeGenerationComponent},

  {path: 'playground/image-processing', component: ImageProcessingComponent},

  {path: 'playground/video-analytics', component: VideoAnalyticsComponent},

  {path: 'playground/audio-analytics', component: AudioAnalyticsComponent},

  // {path: 'playground/ecommerce-recommendation', component: ECommerceRecommendationComponent},
  // {path: 'playground/ecommerce-main', component: EcommerceMainComponent}
  {path: 'playground/ecommerce-load-dataset', component: EcommerceLoadDatasetComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
