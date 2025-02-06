export const fetchParkingSpots = async (zone?: string): Promise<any[]> => {
  const url = zone
    ? `http://localhost:3100/api/parking/all?zone=${zone}`
    : "http://localhost:3100/api/parking/all";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch parking spots");
  }
  return await response.json();
};

export const fetchCurrentReservations = async (userId: string) => {
  const response = await fetch(
    `http://localhost:3100/api/reservations/current/${userId}`
  );
  if (!response.ok) {
    throw new Error("Nie udało się pobrać aktualnych rezerwacji");
  }
  return await response.json();
};

export const fetchParkingIssues = async (): Promise<any> => {
  const url = "http://localhost:3100/api/issues/all";

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch parking issues");
  }

  const data = await response.json();
  console.log("API Response:", data); // Logowanie odpowiedzi API
  return data;
};

export const updateIssueStatus = async (id: string, status: string, resolvedAt: string) => {
  const response = await fetch(`http://localhost:3100/api/issues/${id}`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json", // Ensure JSON content type
    },
    body: JSON.stringify({ status, resolvedAt }),
  });

  if (!response.ok) {
    const errorText = await response.text(); // Capture error response from backend
    console.error("Failed to update issue status:", errorText);
    throw new Error("Failed to update issue status");
  }

  return await response.json();
};
