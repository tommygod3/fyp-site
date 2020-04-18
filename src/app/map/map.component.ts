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
  @ViewChild(MapRectangle, { static: false }) rct: MapRectangle

  center: google.maps.LatLngLiteral
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

  click(event: google.maps.MouseEvent) {
    console.log(event)
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
}
