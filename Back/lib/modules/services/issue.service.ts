import IssueModel from "../schemas/issue.schema";
import { IIssue } from "../models/issue.model";
import { Types } from "mongoose";

class IssueService {
  // Update issue status
  async updateIssueStatus(id: string, status: string, resolvedAt?: string): Promise<IIssue | null> {
    if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
    }

    return await IssueModel.findByIdAndUpdate(
        id,
        { status, resolvedAt },
        { new: true } // Return the updated document
    ).exec();
  } 

  // Tworzenie nowego zgłoszenia
  async createIssue(issueData: IIssue): Promise<IIssue> {
    const newIssue = new IssueModel(issueData);
    return await newIssue.save();
  }

  // Opcjonalnie: Wyszukiwanie istniejących zgłoszeń
  async queryIssues(query: Partial<IIssue>): Promise<IIssue[]> {
    return await IssueModel.find(query).exec();
  }
}

export default IssueService;
