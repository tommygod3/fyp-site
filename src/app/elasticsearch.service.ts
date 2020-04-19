import { Injectable } from '@angular/core';
import { Client, RequestParams, ApiResponse } from 'elasticsearch-browser';
import { Tile } from './tile';
import { GeoJson } from './geojson';
import { TileSearch } from './tile-search';

@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {

  private client: Client;

  public tiles: Tile[] = [];

  constructor() {
    if (!this.client) {
      this.connect();
    }
  }

  private connect() {
    this.client = new Client({
      host: 'https://search-tommygod3-es-b46x7xorl7h6jqnisw5ruua63y.eu-west-2.es.amazonaws.com'
    });
  }

  getTiles(searchParameters: TileSearch, boundingBox: GeoJson): Promise<Tile[]> {
    const params: RequestParams.Search = {
      index: "fyp-tiles",
      body: {
        size: 50,
        query: {
          bool: {
            must: [
              {
                range: {
                  cloud_cover: {
                    lte: searchParameters.maxCloudCover
                  }
                }
              },
              {
                range: {
                  datetime: {
                    gte: searchParameters.dateRange.begin.toISOString(),
                    lte: searchParameters.dateRange.end.toISOString(),
                  }
                }
              },
              {
                range: {
                  size: {
                    gte: searchParameters.minFileSize
                  }
                }
              }
            ],
            filter: {
              geo_shape: {
                location: {
                  shape: boundingBox,
                  relation: "intersects"
                }
              }
            }
          }
        }
      }
    }
    console.log(JSON.stringify(params));

    const promise = new Promise<Tile[]>((resolve, reject) => {
      this.client
        .search(params)
        .then((response: ApiResponse) => {
          let tiles: Tile[] = [];
          response.hits.hits.forEach(hit => {
            tiles.push(hit._source)
          });
          resolve(tiles);
        },
          err => {
            console.log(err);
            reject([]);
          }
        );
    });
    return promise;
  }
  
}
