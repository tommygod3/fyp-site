import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TileSearch } from '../tile-search';
import { Tile } from '../tile';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent implements OnInit {
  activeTabIndex: number = 0;
  searchData: TileSearch = {
    maxCloudCover: 100,
    minFileSize: 0,
    dateRange: {
      begin: new Date("01/05/2019"),
      end: new Date(Date.now())
    }
  };

  @Output() search = new EventEmitter<TileSearch>();
  @Output() visualise = new EventEmitter<any>();

  tiles: Tile[] = [];

  constructor() { }


  ngOnInit(): void {
  }

  download(path: string) {
    window.location.href = `http://data.ceda.ac.uk${path}`;
  }

  visualisePolygon(path: string) {
    this.visualise.emit({id: path});
  }

  update() {
    this.searchData.minFileSize *= 1000000;
    this.search.emit(this.searchData);
    this.activeTabIndex = 1;
  }
}
