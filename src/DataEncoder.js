import { DataStream } from "./DataStream.js";

export class DataEncoder {
  encode(text, options = {}) {
    const dataStream = new DataStream(text, options);
    return dataStream.build();
  }
}
