export interface IIssue {
  _id?: string;
  spotId: string;
  issueType: string;
  description: string;
  status: "open" | "closed";
  reportedAt: Date;
  resolvedAt?: Date;
  userId: string;
}
