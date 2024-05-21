import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CallService } from "../../services/call.service";
import { NgxGaugeModule } from "ngx-gauge";
import { NgxGaugeType } from "ngx-gauge/gauge/gauge";
import { Subscription, interval } from "rxjs";
import { Chart, Colors } from "chart.js/auto";
import { User } from "../../interface/user";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./landing.component.css"],
})
export class LandingComponent implements AfterViewInit {
  @ViewChild("ngxGauge") ngxGauge!: NgxGaugeModule;
  incoming: any[] = [];
  outgoing: any[] = [];
  missed: any[] = [];
  attended: any[] = [];
  Good: any[] = [];
  Normal: any[] = [];
  Poor: any[] = [];
  chart: any;

  source_good: Array<any> = [];
  source_poor: Array<any> = [];
  source_normal: Array<any> = [];
  source_total: Array<any> = [];
  loading: boolean = false;
  total = 0;
  source: Array<any> = [];
  source_outgoing: Array<any> = [];
  source_attended: Array<any> = [];
  source_missed: Array<any> = [];
  user_data: User | null = null;
  gaugeType: NgxGaugeType = "arch";
  gaugeValue = 0;
  gaugeLabel = "Incoming Calls";
  gaugeAppendText = "";

  constructor(
    private router: Router,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private callService: CallService
  ) {
    this.loading = true;
  }

  ngAfterViewInit(): void {
    if (!this.authService.LoginStatus()) {
      this.router.navigateByUrl("/login");
    } else {
      this.user_data = this.authService.getUserData();
    }

    const cd = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
    this.callService.getCart(cd).subscribe((result) => {
      this.total = result.length;
      result.forEach((x: any) => {
        console.log(x);
        console.log("result : ", result);
        if (x.event == 1) {
          this.incoming.push(x);
        } else {
          this.outgoing.push(x);
        }

        if (x.call_status == 1) {
          this.attended.push(x);
        } else {
          this.missed.push(x);
        }
        console.log("******************* ", x.ai_narration);
        if (x["ai_narration"] == undefined) {
          return;
        } else if (x.ai_narration.recepitionist_rating === "Good") {
          this.Good.push(x);
        } else if (x.ai_narration.recepitionist_rating === "Normal") {
          this.Normal.push(x);
        } else {
          this.Poor.push(x);
        }
      });
      console.log("incoming : ", this.incoming);
      console.log("attended : ", this.attended);
      this.total = result.length;

      console.log("total : ", this.total);

      // console.log('tot : ', tot)
      // if (this.ngxGauge) {
      this.updateGauge();
      this.createChart();
      this.loading = false;
      this.changeDetectorRef.detectChanges();
      // }
    });
  }

  createChart() {
    console.log("coming");
    this.source_good = this.Good;
    this.source_poor = this.Poor;
    this.source_normal = this.Normal;
    // const percentage = divi * 100;
    // const arcLength = (percentage / 100) * Math.PI;

    this.chart = new Chart("MyChart", {
      type: "doughnut",
      data: {
        labels: [
          "Good: " + String(this.source_good.length),
          "Normal: " + String(this.source_normal.length),
          "Poor: " + String(this.source_poor.length),
          "Total:" +
            String(
              this.source_good.length +
                this.source_normal.length +
                this.source_poor.length
            ),
        ],
        datasets: [
          {
            data: [
              this.source_good.length,
              this.source_normal.length,
              this.source_poor.length,
            ],
            backgroundColor: ["aqua", "teal", "magenta"],
            borderColor: ["indigo"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        radius: 100,
        cutout: "70%",
        rotation: 0,
        circumference: 360,
        animation: {
          animateRotate: true,
          animateScale: true,
        },
        plugins: {
          title: {
            display: true,
            text: "Call Rating",
            color: "white",
            font: {
              size: 20,
            },
          },
          colors: {
            enabled: true,
          },

          legend: {
            display: true,

            labels: {
              color: "white",
              font: {
                size: 16,
              },
            },
          },

          // tooltip: {
          //   enabled: false
          // }
        },
      },
    });
  }

  updateGauge() {
    this.gaugeValue = this.incoming.length + this.outgoing.length;
    this.source = this.incoming;
    this.source_attended = this.attended;
    this.source_missed = this.missed;
    this.source_outgoing = this.outgoing;
    console.log(this.source);
    this.loading = false;
    this.changeDetectorRef.detectChanges();
  }

  gotoCalls() {
    this.router.navigateByUrl("/calls");
  }

  gotoIAM() {
    this.router.navigateByUrl("/iam");
  }

  goto_my_activity() {
    this.router.navigate(["/myactivity"], {
      queryParams: { actor_id: this.user_data?.phoneno },
    });
  }

  pet_records() {
    this.router.navigate(["/user"], { queryParams: { role: "Patient" } });
  }

  gotoappoint() {
    this.router.navigate(["/appointments"], {
      queryParams: { phoneno: this.user_data?.phoneno },
    });
  }
}
