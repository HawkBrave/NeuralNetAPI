import fs from "fs";
import readline from 'readline';

export type DataPair = {
  y: number
  x: Array<number>
};

export interface Loader {
  getDataArray(filename: string, size: number): Promise<Array<DataPair>>;
}

export interface CSVLoader extends Loader {
}

export class MNISTLoader implements CSVLoader {
  basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  async getDataArray(filename: string, size: number): Promise<Array<DataPair>> {
    let datastream = fs.createReadStream(`${this.basePath}/${filename}`);
    let dataintface = readline.createInterface({input: datastream, crlfDelay: Infinity});

    let dataArray = new Array();
    for await (const line of dataintface) {
      let data = line.trim().split(',');
      let y = parseInt(<string> (data.shift()));
      // normalize data
      let x = data.map(val => parseInt(val) / 255);
      dataArray.push(<DataPair> {x, y});
    }
    dataArray.shift();
    return dataArray;
  }
}