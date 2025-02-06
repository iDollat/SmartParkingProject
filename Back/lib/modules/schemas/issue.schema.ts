import { Schema, model } from "mongoose";
import { IIssue } from "../models/issue.model";

const IssueSchema = new Schema<IIssue>({
  spotId: { type: String, required: true },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  reportedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date, default: null },
  userId: { type: String, required: true },
});

export default model<IIssue>("Issue", IssueSchema, "issues");
