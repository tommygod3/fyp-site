import { Injectable } from '@angular/core';
import { Client, RequestParams, ApiResponse } from 'elasticsearch-browser';
import { Tile } from './tile';

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

  getTiles(): Promise<Tile[]> {
    const params: RequestParams.Search = {
      index: "fyp-tiles",
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  cloud_cover: {
                    lte: 15
                  }
                }
              },
              {
                range: {
                  size: {
                    gte: 500000000
                  }
                }
              }
            ],
            filter: {
                geo_shape: {
                    location: {
                        shape: {
                            type: "point",
                            coordinates : [-0.792584,51.798401]
                        },
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
