export interface VectorData {
  id: string;
  vector: number[];
  title: string;
  url: string;
  info: string;
  date: string;
}

export interface Collection {
  name: string;
}

export interface QdrantResponse<T> {
  result: T;
  status: string;
  time: number;
}

export interface DataJson {
  title: string;
  url: string;
  info: string;
  date: string;
}
