import { Component } from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
    imports: [
        RouterOutlet,
    ],
  standalone: true
})
export class AppComponent {

  constructor(private router: Router) {
  }


  goHome() {
    this.router.navigate(['']);
  }
}
