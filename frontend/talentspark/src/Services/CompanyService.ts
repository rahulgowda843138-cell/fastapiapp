import api from "./api";
import type { Company } from "../types/company";

// Get all companies
export async function getCompanies(): Promise<Company[]> {
  try {
    const response = await api.get<Company[]>("/company");
    return response.data;
  } catch (error) {
    console.error("Get Companies Error:", error);
    throw error;
  }
}

// Get company by ID
export async function getCompanyById(
  id: number
): Promise<Company> {
  try {
    const response = await api.get<Company>(
      `/company/${id}`
    );

    return response.data;
  } catch (error) {
    console.error("Get Company Error:", error);
    throw error;
  }
}

// Create company
export async function createCompany(
  company: Company
): Promise<Company> {
  try {
    const response = await api.post<Company>(
      "/company",
      company
    );

    return response.data;
  } catch (error) {
    console.error("Create Company Error:", error);
    throw error;
  }
}

// Update company
export async function updateCompany(
  id: number,
  company: Company
): Promise<Company> {
  try {
    const response = await api.put<Company>(
      `/company/${id}`,
      company
    );

    return response.data;
  } catch (error) {
    console.error("Update Company Error:", error);
    throw error;
  }
}

// Delete company
export async function deleteCompany(
  id: number
): Promise<void> {
  try {
    await api.delete(`/company/${id}`);
  } catch (error) {
    console.error("Delete Company Error:", error);
    throw error;
  }
}