export interface IParkingSpot {
  spotId: string;
  zone: string;
  isAvailable: boolean;
  reservedUntil?: Date | null;
  type: "car" | "truck";
}

export type Query<T> = {
  [key: string]: T;
};
