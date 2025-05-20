// types.ts
export type DatasetFile = {
  file: File;
  name: string;
  size: number;
  type: string;
};

export type DatasetRow = {
  user_id: string;
  u_idx: number;
  product_id: string;
  product_title: string;
  category: string;
  timestamp: string;
};
