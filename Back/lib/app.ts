import Index from "./index";
import IndexController from "./controllers/index.controller";
import ParkingController from "./controllers/parkingSpot.controller";
import UserController from "./controllers/user.controller";
import IssueController from "./controllers/issue.controller";
import ReservationController from "./controllers/reservation.controller";

const app: Index = new Index([
  new UserController(),
  new ParkingController(),
  new IssueController(),
  new ReservationController(),
  new IndexController(),
]);

app.listen();
