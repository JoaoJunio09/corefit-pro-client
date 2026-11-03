import { AccountCredentials } from "../auth/AccountCredentials";

export interface TraineeRequest {
  firstName: string;
  lastName: string;
  username: string;
  personalTrainerId: string;
  credentials: AccountCredentials;
}