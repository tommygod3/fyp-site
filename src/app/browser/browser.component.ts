import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TileSearch } from '../tile-search';
import { Tile } from '../tile';
import { PatchSearch, LabelList } from '../patch-search';
import { Patch } from '../patch';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent implements OnInit {
  activeTabIndex: number = 0;

  hidden = false;

  tiles: Tile[] = [];
  patches: Patch[] = [];

  showTiles: boolean = true;
  showPatches: boolean = false;

  tileSearchData: TileSearch = {
    maxCloudCover: 100,
    minFileSize: 0,
    dateRange: {
      begin: new Date("01/05/2019"),
      end: new Date(Date.now())
    }
  };

  patchSearchData: PatchSearch = {
    labels: [],
    dateRange: {
      begin: new Date("01/05/2019"),
      end: new Date(Date.now())
    }
  };

  labelList: string[] = new LabelList().getLabelList();

  @Output() search = new EventEmitter<TileSearch | PatchSearch>();
  @Output() visualise = new EventEmitter<any>();
  @Output() inspectTile = new EventEmitter<string>();
  @Output() inspectPatches = new EventEmitter<string>();

  constructor() { }


  ngOnInit(): void {
  }

  swapHidden(): void {
    this.hidden = !this.hidden;
  }

  selectTiles(): void {
    this.showTiles = true;
    this.showPatches = false;
  }

  selectPatches(): void {
    this.showPatches = true;
    this.showTiles = false;
  }

  showTileFromPatch(path: string) {
    this.inspectTile.emit(path);
  }

  showPatchesFromTile(path: string) {
    this.inspectPatches.emit(path);
  }

  download(path: string): void {
    window.location.href = `http://data.ceda.ac.uk${path}`;
  }

  visualisePolygon(data: any): void {
    if (data.cloud_cover !== undefined) {
      this.visualise.emit({id: this.tiles.indexOf(data)});
    }
    else {
      this.visualise.emit({id: this.patches.indexOf(data)});
    }
  }

  updateSearch(searchData: TileSearch | PatchSearch): void {
    this.search.emit(searchData);
    this.activeTabIndex = 1;
  }

  tileHasPatches(tile: any): boolean {
    if (tile.cloud_cover <= 15 && tile.size >= 500) {
      return true;
    }
    else return false;
  }
}
