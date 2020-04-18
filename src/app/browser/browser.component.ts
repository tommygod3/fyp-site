import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent implements OnInit {

  constructor() { }

  activeTabIndex = 0;
  data = {
    maxCloudCover: 100,
    minFileSize: 1000000000,
    date: ""
  }

  update() {
    //emit even to map
    //after data loaded change page
    this.activeTabIndex = 1;
    console.log(this.data);
  }

  ngOnInit(): void {
  }

}
