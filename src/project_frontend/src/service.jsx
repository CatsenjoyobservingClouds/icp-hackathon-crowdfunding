import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory, canisterId } from "../../declarations/project_backend";

// Use the local back-end during development
const agent = new HttpAgent({
  host: process.env.NODE_ENV === "production"
    ? "https://boundary.ic0.app"  // Keep the IC boundary host in production
    : "http://127.0.0.1:4943",    // Use local server during development
});

if (process.env.NODE_ENV !== "production") {
  agent.fetchRootKey(); // This is required to fetch root key in non-prod environments.
}

const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId,
});

export const createProject = async (title, description, fundingGoal, durationDays) => {
  try {
    const result = await actor.create_project(title, description, fundingGoal, durationDays);
    return result;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const listProjects = async () => {
  try {
    const result = await actor.list_projects();
    return result;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const contributeToProject = async (projectId, amount) => {
  try {
    const result = await actor.contribute(projectId, amount);
    return result;
  } catch (error) {
    console.error("Error contributing to project:", error);
    throw error;
  }
};

export const releaseFunds = async (projectId) => {
  try {
    const result = await actor.release_funds(projectId);
    return result;
  } catch (error) {
    console.error("Error releasing funds:", error);
    throw error;
  }
};

export const claimRefund = async (projectId) => {
  try {
    const result = await actor.claim_refund(projectId);
    return result;
  } catch (error) {
    console.error("Error claiming refund:", error);
    throw error;
  }
};
