import { Component, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';
import { MapMarker, GoogleMap, MapInfoWindow, MapRectangle } from '@angular/google-maps';

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

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
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

  addPolygon() {
    this.polygons.push({
      options: {
        draggable: false,
        editable: false,
        geodesic: true,
      },
      paths: [
        {lat: 52.34135509726958, lng: -1.5321045},
        {lat: 51.354439390266904, lng: -1.5638733},
        {lat: 51.32452335478603, lng: 0.011254122594852},
        {lat: 52.31036691499413, lng: 0.077757925309447}
      ],
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
