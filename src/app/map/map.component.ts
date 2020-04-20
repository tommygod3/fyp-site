import { Component, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';
import { GoogleMap } from '@angular/google-maps';
import { ElasticsearchService } from '../elasticsearch.service';
import { Tile } from '../tile';
import { GeoJson } from '../geojson'
import { TileSearch } from '../tile-search';
import { BrowserComponent } from '../browser/browser.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';
import { PatchSearch } from '../patch-search';
import { Patch } from '../patch';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild(BrowserComponent, { static: false }) browser: BrowserComponent

  center: google.maps.LatLngLiteral
  screen: google.maps.LatLngBounds
  options: google.maps.MapOptions = {
    zoom: 6,
    disableDoubleClickZoom: true,
    mapTypeId: 'roadmap',
    maxZoom: 15,
    minZoom: 6,
    fullscreenControl: false,
    scaleControl: true
  }
  polygons = []
  tiles: Tile[] = [];
  patches: Patch[] = [];

  constructor(private elasticsearchService: ElasticsearchService,
              public dialog: MatDialog) { }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    })
  }

  click(event: google.maps.MouseEvent) {
    console.log(event);
  }

  clickPoly(polygonClicked) {
    let dialogRef;
    if (this.tiles.length > 0) {
      dialogRef = this.dialog.open(DetailsDialogComponent, {
        width: "250px",
        data: this.tiles[polygonClicked.id]
      })
    }
    else if (this.patches.length > 0) {
      dialogRef = this.dialog.open(DetailsDialogComponent, {
        width: "250px",
        data: this.patches[polygonClicked.id]
      })
    }
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.type === "tile") {
          this.showPatchesFromTile(result.path);
        }
        else if (result.type === "patch") {
          this.showTileFromPatch(result.path);
        }
      }
    })
  }

  hoverOnPoly(polygonHovered) {
    this.polygons[polygonHovered.id].options = {
      draggable: false,
      editable: false,
      geodesic: true,
      fillColor: "#57de71",
      fillOpacity: 0.3,
      strokeWeight: 2,
      strokeColor: "#57de71",
      strokeOpacity: 1,
    }
  }

  hoverOffPoly(polygonHovered) {
    this.polygons[polygonHovered.id].options = {
      draggable: false,
      editable: false,
      geodesic: true,
      fillColor: "#398ade",
      fillOpacity: 0.15,
      strokeWeight: 1,
      strokeColor: "#398ade",
      strokeOpacity: 0.8,
    }
  }

  onSearch(searchData: any) {
    this.polygons = [];
    this.screen = this.map.getBounds();
    let geojson: GeoJson = new GeoJson(this.screen);

    if (searchData.maxCloudCover !== undefined) {
      this.patches = [];
      this.elasticsearchService.getTiles(searchData, geojson).then(value => {
        this.tiles = value;
        this.browser.tiles = value;
        this.tiles.forEach(tile => {
          this.addPolygon(tile.location, tile.path);
        });
      })
    }
    else if (searchData.maxCloudCover === undefined) {
      this.tiles = [];
      this.elasticsearchService.getPatches(searchData, geojson).then(value => {
        this.patches = value;
        this.browser.patches = value;
        this.patches.forEach(patch => {
          this.addPolygon(patch.location, patch.path);
        });
      })
    }
  }

  showTileFromPatch(path: string) {
    this.polygons = [];
    this.elasticsearchService.getTile(path).then(value => {
      this.tiles.push(value);
      this.browser.tiles.push(value);
      this.tiles.forEach(tile => {
        this.addPolygon(tile.location, tile.path);
      });
    })
    this.browser.selectTiles();
    this.patches = [];
    this.browser.patches = [];
  }

  showPatchesFromTile(path: string) {
    this.polygons = [];
    this.elasticsearchService.getPatchesFromTile(path).then(value => {
      this.patches = value;
      this.browser.patches = value;
      this.patches.forEach(patch => {
        this.addPolygon(patch.location, patch.path);
      });
    })
    this.browser.selectPatches();
    this.tiles = [];
    this.browser.tiles = [];
  }

  addPolygon(location: GeoJson, path: string) {
    var points = []
    location.coordinates[0].forEach(coordinate => {
      points.push({lat: coordinate[1], lng: coordinate[0]})
    });
    this.polygons.push({
      options: {
        draggable: false,
        editable: false,
        geodesic: true,
        fillColor: "#398ade",
        fillOpacity: 0.15,
        strokeWeight: 1,
        strokeColor: "#398ade",
        strokeOpacity: 0.8,
      },
      paths: points,
      id: this.polygons.length
    })
  }
}
