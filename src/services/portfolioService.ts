import { PortfolioData } from "../types";

const API_URL = "/api/data";

export const portfolioService = {
  async getData(): Promise<PortfolioData> {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch data");
    return response.json();
  },

  async updateData(data: PortfolioData, token: string): Promise<void> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update data");
  },

  async sendMessage(message: any): Promise<void> {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) throw new Error("Failed to send message");
  }
};
