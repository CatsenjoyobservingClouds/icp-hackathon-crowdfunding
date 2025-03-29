import React, { useState, useEffect } from "react";
import { createProject, listProjects, contributeToProject, releaseFunds, claimRefund } from "./service";

const App = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fundingGoal, setFundingGoal] = useState(0);
  const [durationDays, setDurationDays] = useState(0);
  const [amountToContribute, setAmountToContribute] = useState(0);

  const fetchProjects = async () => {
    try {
      const result = await listProjects();
      setProjects(result);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      const result = await createProject(title, description, fundingGoal, durationDays);
      console.log("Project Created:", result);
      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleContribute = async (projectId) => {
    try {
      const result = await contributeToProject(projectId, amountToContribute);
      console.log("Contribution Result:", result);
      fetchProjects();
    } catch (error) {
      console.error("Error contributing:", error);
    }
  };

  const handleReleaseFunds = async (projectId) => {
    try {
      const result = await releaseFunds(projectId);
      console.log("Funds Released:", result);
      fetchProjects();
    } catch (error) {
      console.error("Error releasing funds:", error);
    }
  };

  const handleClaimRefund = async (projectId) => {
    try {
      const result = await claimRefund(projectId);
      console.log("Refund Claimed:", result);
      fetchProjects();
    } catch (error) {
      console.error("Error claiming refund:", error);
    }
  };

  return (
    <div>
      <h1>Crowdfunding Platform</h1>
      
      <h2>Create Project</h2>
      <input
        type="text"
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Funding Goal"
        value={fundingGoal}
        onChange={(e) => setFundingGoal(Number(e.target.value))}
      />
      <input
        type="number"
        placeholder="Duration (days)"
        value={durationDays}
        onChange={(e) => setDurationDays(Number(e.target.value))}
      />
      <button onClick={handleCreateProject}>Create Project</button>

      <h2>Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p>Funding Goal: {project.funding_goal} Tokens</p>
            <p>Current Amount: {project.current_amount} Tokens</p>
            <p>Status: {project.status}</p>
            <input
              type="number"
              placeholder="Amount to Contribute"
              value={amountToContribute}
              onChange={(e) => setAmountToContribute(Number(e.target.value))}
            />
            <button onClick={() => handleContribute(project.id)}>Contribute</button>
            {project.status === "Funded" && (
              <button onClick={() => handleReleaseFunds(project.id)}>Release Funds</button>
            )}
            {project.status === "Expired" && (
              <button onClick={() => handleClaimRefund(project.id)}>Claim Refund</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
