import { Component } from '@angular/core';
import {PaymentBatchService} from "./services/payment-batch.service";
import {NgIf} from "@angular/common";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    RouterOutlet
  ],
  standalone: true
})
export class AppComponent {

}
