import { Injectable } from '@angular/core';
import { Client, RequestParams, ApiResponse } from 'elasticsearch-browser';
import { Tile } from './tile';
import { GeoJson } from './geojson';
import { TileSearch } from './tile-search';
import { PatchSearch } from './patch-search';
import { Patch } from './patch';

@Injectable({
  providedIn: 'root'
})
export class ElasticsearchService {

  private client: Client;

  public totalTiles: number = 0;
  public totalPatches: number = 0;

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
                    gte: searchParameters.minFileSize * 1000000
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
    const promise = new Promise<Tile[]>((resolve, reject) => {
      this.client
        .search(params)
        .then((response: ApiResponse) => {
          let tiles: Tile[] = [];
          this.totalTiles = response.hits.total.value;
          response.hits.hits.forEach(hit => {
            hit._source.size /= 1000000
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

  getPatches(searchParameters: PatchSearch, boundingBox: GeoJson): Promise<Patch[]> {
    const params: RequestParams.Search = {
      index: "fyp-patches",
      body: {
        size: 100,
        query: {
          bool: {
            must: [
              {
                range: {
                  datetime: {
                    gte: searchParameters.dateRange.begin.toISOString(),
                    lte: searchParameters.dateRange.end.toISOString(),
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
    searchParameters.labels.forEach(label => {
      params.body.query.bool.must.push({
        "term": {
          "labels.keyword": {
            "value": label
          }
        }
      })
    });

    const promise = new Promise<Patch[]>((resolve, reject) => {
      this.client
        .search(params)
        .then((response: ApiResponse) => {
          this.totalPatches = response.hits.total.value;
          let patches: Patch[] = [];
          response.hits.hits.forEach(hit => {
            hit._source.size /= 1000000
            patches.push(hit._source)
          });
          resolve(patches);
        },
          err => {
            console.log(err);
            reject([]);
          }
        );
    });
    return promise;
  }


  getTile(pathSearch: string): Promise<Tile> {
    const params: RequestParams.Search = {
      index: "fyp-tiles",
      body: {
        size: 1,
        query: {
          bool: {
            must: [
              {
                match_phrase_prefix: {
                  path : pathSearch
                }
              }
            ]
          }
        }
      }
    }

    const promise = new Promise<Tile>((resolve, reject) => {
      this.client
        .search(params)
        .then((response: ApiResponse) => {
          this.totalTiles = response.hits.total.value;
          let tile: Tile;
          response.hits.hits.forEach(hit => {
            hit._source.size /= 1000000
            tile = hit._source;
          });
          resolve(tile);
        },
          err => {
            console.log(err);
            reject([]);
          }
        );
    });
    return promise;
  }



  getPatchesFromTile(pathSearch: string): Promise<Patch[]> {
    const params: RequestParams.Search = {
      index: "fyp-patches",
      body: {
        size: 100,
        query: {
          bool: {
            must: [
              {
                match_phrase_prefix: {
                  path : pathSearch
                }
              }
            ]
          }
        }
      }
    }

    const promise = new Promise<Patch[]>((resolve, reject) => {
      this.client
        .search(params)
        .then((response: ApiResponse) => {
          this.totalPatches = response.hits.total.value;
          let patches: Patch[] = [];
          response.hits.hits.forEach(hit => {
            hit._source.size /= 1000000
            patches.push(hit._source)
          });
          resolve(patches);
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
