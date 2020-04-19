import { Component, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';
import { GoogleMap } from '@angular/google-maps';
import { ElasticsearchService } from '../elasticsearch.service';
import { Tile } from '../tile';
import { GeoJson } from '../geojson'
import { TileSearch } from '../tile-search';
import { BrowserComponent } from '../browser/browser.component';
import { MatDialog } from '@angular/material/dialog';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';

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

  clickPoly(polygon) {
    let tileMatch: Tile;
    this.tiles.forEach(tile => {
      if (tile.path == polygon.id) {
        tileMatch = tile;
      }
    });
    let dialogRef = this.dialog.open(DetailsDialogComponent, {
      width: "250px",
      data: tileMatch
    })
  }

  hoverOnPoly(polygonHovered) {
    let indexFound = this.polygons.findIndex(polygon => 
      polygon.id === polygonHovered.id
    )
    this.polygons[indexFound].options = {
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
    let indexFound = this.polygons.findIndex(polygon => 
      polygon.id === polygonHovered.id
    )
    this.polygons[indexFound].options = {
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

  onSearch(searchData: TileSearch) {
    this.polygons = [];
    this.screen = this.map.getBounds();
    let geojson: GeoJson = new GeoJson(this.screen);

    this.elasticsearchService.getTiles(searchData, geojson).then(value => {
      this.tiles = value;
      this.browser.tiles = value;
      this.tiles.forEach(tile => {
        this.addPolygon(tile.location, tile.path);
      });
    })
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
      id: path
    })
  }
}
