export interface IReservation {
  spotId: string;
  userId: string;
  reservationStart: Date;
  reservedUntil: Date;
}

export type Query<T> = {
  [key: string]: T;
};
