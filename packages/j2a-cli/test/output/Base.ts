export interface Base {
  code: number;
  bigInt: number;
  doubleValue: number;
  message: any; // ⚠️⚠️⚠️ null value
  : string; // ⚠️⚠️⚠️ empty name
  auth: boolean;
  pageInfo: PageInfo;
  data: Data[];
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
}

export interface Data {
  id: string;
  title: string;
  price: number;
  hasBuy: boolean;
  studentNum: number;
}

