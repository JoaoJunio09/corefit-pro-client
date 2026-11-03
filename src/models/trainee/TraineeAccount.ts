export interface TraineeAccount {
  traineeId: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  recoveryEmail: string;
  enabled: boolean;
}

export type TraineeAccountRequest = Omit<TraineeAccount, 'traineeId'>;
