import api from "./api";
import type { Job } from "../types/job";

// ---------------------
// Get All Jobs
// ---------------------
export async function getJobs(): Promise<Job[]> {
  try {
    const response = await api.get<Job[]>("/job");
    return response.data;
  } catch (error) {
    console.error("Get Jobs Error:", error);
    throw error;
  }
}

// ---------------------
// Get Job By ID
// ---------------------
export async function getJobById(
  id: number
): Promise<Job> {
  try {
    const response = await api.get<Job>(`/job/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get Job Error:", error);
    throw error;
  }
}

// ---------------------
// Create Job
// ---------------------
export async function createJob(
  job: Job
): Promise<Job> {
  try {
    const response = await api.post<Job>("/job", job);
    return response.data;
  } catch (error) {
    console.error("Create Job Error:", error);
    throw error;
  }
}

// ---------------------
// Update Job
// ---------------------
export async function updateJob(
  id: number,
  job: Job
): Promise<Job> {
  try {
    const response = await api.put<Job>(
      `/job/${id}`,
      job
    );

    return response.data;
  } catch (error) {
    console.error("Update Job Error:", error);
    throw error;
  }
}

// ---------------------
// Delete Job
// ---------------------
export async function deleteJob(
  id: number
): Promise<void> {
  try {
    await api.delete(`/job/${id}`);
  } catch (error) {
    console.error("Delete Job Error:", error);
    throw error;
  }
}