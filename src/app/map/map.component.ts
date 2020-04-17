import { Component, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';
import { MapMarker, GoogleMap, MapInfoWindow, MapRectangle } from '@angular/google-maps';
import { ElasticsearchService } from '../elasticsearch.service';
import { Tile } from '../tile';
import { GeoJson } from '../geojson'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow
  @ViewChild(MapRectangle, { static: false }) rct: MapRectangle

  zoom = 12
  center: google.maps.LatLngLiteral
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
    maxZoom: 15,
    minZoom: 8,
  }
  markers = []
  polygons = []
  infoContent = ''

  constructor(private elasticsearchService: ElasticsearchService) { }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    })
    let tiles: Tile[] = [];
    this.elasticsearchService.getTiles().then(value => {
      tiles = value;
      tiles.forEach(tile => {
        console.log(tile);
      });
      this.addPolygon(tiles[0].location, "#ff00ff");
    })

  }

  ngAfterViewInit() {
    this.rct.options = {
      editable: true,
      draggable: true
    }
    this.rct.bounds = {north: 51.5, south: 51.3, west: -0.5, east: 0}
  }

  zoomIn() {
    if (this.zoom < this.options.maxZoom) this.zoom++
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom) this.zoom--
  }

  click(event: google.maps.MouseEvent) {
    console.log(event)
  }

  logCenter() {
    console.log(JSON.stringify(this.map.getCenter()))
  }

  addMarker() {
    this.markers.push({
      position: {
        lat: this.center.lat + ((Math.random() - 0.5) * 2) / 10,
        lng: this.center.lng + ((Math.random() - 0.5) * 2) / 10,
      },
      label: {
        color: 'red',
        text: 'Marker label ' + (this.markers.length + 1),
      },
      title: 'Marker title ' + (this.markers.length + 1),
      info: 'Marker info ' + (this.markers.length + 1),
      options: {
        animation: google.maps.Animation.BOUNCE,
      },
    })
  }

  addPolygon(location: GeoJson, color: string) {
    var points = []
    location.coordinates[0].forEach(coordinate => {
      points.push({lat: coordinate[1], lng: coordinate[0]})
    });
    this.polygons.push({
      options: {
        draggable: false,
        editable: false,
        geodesic: true,
        strokeColor: color
      },
      paths: points,
    })
  }

  addRectangle() {
    this.rct.options = {
      editable: true,
      draggable: true
    }
    this.rct.bounds = {north: 51.5, south: 51.3, west: -0.5, east: 0}
  }

  openInfo(marker: MapMarker, content) {
    this.infoContent = content
    this.info.open(marker)
  }
}
