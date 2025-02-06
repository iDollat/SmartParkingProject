import { Request, Response, Router } from "express";
import IssueService from "../modules/services/issue.service";

class IssueController {
  public path = "/api/issues";
  public router = Router();
  private issueService = new IssueService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create`, this.createIssue);
    this.router.get(`${this.path}/all`, this.getAllIssues); // Nowy endpoint
    this.router.put(`${this.path}/:id`, this.updateIssueStatus);
  }

  private createIssue = async (request: Request, response: Response) => {
    const { spotId, issueType, description, userId } = request.body;
    console.log("UserId: " + userId);

    try {
      const newIssue = await this.issueService.createIssue({
        spotId,
        issueType,
        description,
        userId,
        reportedAt: new Date(),
        status: "open",
      });
      response
        .status(201)
        .json({ message: "Zgłoszenie zostało zapisane", issue: newIssue });
    } catch (error) {
      console.error("Błąd podczas tworzenia zgłoszenia:", error);
      response
        .status(500)
        .json({ error: "Wystąpił błąd podczas tworzenia zgłoszenia" });
    }
  };

  // Nowa metoda: Pobieranie wszystkich zgłoszeń
  private getAllIssues = async (_: Request, response: Response) => {
    try {
      const issues = await this.issueService.queryIssues({});
      response.status(200).json({ issues });
    } catch (error) {
      console.error("Błąd podczas pobierania zgłoszeń:", error);
      response
        .status(500)
        .json({ error: "Wystąpił błąd podczas pobierania zgłoszeń" });
    }
  };

  private updateIssueStatus = async (request: Request, response: Response) => {
    const { id } = request.params; // Extract ID from URL
    const { status, resolvedAt } = request.body; // Extract status and resolvedAt from body

    if (!status || !["open", "closed"].includes(status)) {
        return response.status(400).json({ error: `Invalid status value: ${status}` });
    }

    try {
        const updatedIssue = await this.issueService.updateIssueStatus(id, status, resolvedAt);
        if (!updatedIssue) {
            return response.status(404).json({ error: "Issue not found" });
        }
        response.status(200).json({ message: "Issue status updated", issue: updatedIssue });
    } catch (error) {
        console.error("Error updating issue:", error.message);
        response.status(500).json({ error: "Internal server error" });
    }
  };
}

export default IssueController;