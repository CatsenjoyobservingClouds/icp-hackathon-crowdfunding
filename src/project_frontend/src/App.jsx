import React, { useState, useEffect } from 'react';
import './formStyles.css';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory, canisterId } from "../../declarations/project_backend/index";
import { Principal } from '@dfinity/principal';

const agent = new HttpAgent({ host: 'https://icp0.io' });

agent.fetchRootKey().catch((err) => {
  console.log("Failed to fetch root key", err);
});

const actor = Actor.createActor(idlFactory, {
  agent,
  canisterId: canisterId,
});

function App() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    fundingGoal: 0,
    duration: 0,
  });
  const [contributionAmount, setContributionAmount] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [userPrincipal, setUserPrincipal] = useState(null);

  
    async function fetchProjects() {
      try {
        const projectList = await actor.list_projects();
        const projectsWithConvertedValues = projectList.map(project => ({
          ...project,
          fundingGoal: project.funding_goal ? Number(project.fundingGoal.toString()) : 0,  // Convert BigInt to Number
          duration: project.duration ? Number(project.duration.toString()) : 0,  // Convert BigInt to Number
        }));
        console.log(projectsWithConvertedValues)
        setProjects(projectsWithConvertedValues);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    }
  
    useEffect(() => {
      fetchProjects();  // This should now be defined correctly
    }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      const projectId = await actor.create_project(
        newProject.title,
        newProject.description,
        BigInt(newProject.fundingGoal),
        BigInt(newProject.duration)
      );
      console.log(projectId)
      alert(`Project created with ID: ${projectId.Ok}`);
      setNewProject({
        title: '',
        description: '',
        fundingGoal: '',
        duration: '',
      });
      
      fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleContribute = async (projectId) => {
    try {
      await actor.contribute(projectId, contributionAmount);
      alert(`Successfully contributed ${contributionAmount} to project ${projectId}`);
      setContributionAmount('');
      fetchProjects();
    } catch (err) {
      console.error('Error contributing to project:', err);
    }
  };

  const handleReleaseFunds = async (projectId) => {
    try {
      await actor.release_funds(projectId);
      alert('Funds released successfully');
      fetchProjects();
    } catch (err) {
      console.error('Error releasing funds:', err);
    }
  };

  const handleClaimRefund = async (projectId) => {
    try {
      await actor.claim_refund(projectId);
      alert('Refund claimed successfully');
      fetchProjects();
    } catch (err) {
      console.error('Error claiming refund:', err);
    }
  };

  return (
    <div className="App">
      <h1>ICP Crowdfunding</h1>

      {/* Project Creation Form */}
      <div className="form-container">
        <h2>Create New Project</h2>
        <form onSubmit={handleCreateProject}>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </div>
          <div>
            <label>Funding Goal</label>
            <input
              type="number"
              value={newProject.fundingGoal}
              onChange={(e) => setNewProject({ ...newProject, fundingGoal: e.target.value })}
            />
          </div>
          <div>
            <label>Duration (Days)</label>
            <input
              type="number"
              value={newProject.duration}
              onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
            />
          </div>
          <button type="submit">Create Project</button>
        </form>
      </div>

      {/* Projects List */}
      <h2>Active Projects</h2>
      {projects.length > 0 ? (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p>
                Funding Goal: {project.funding_goal} | Current Amount: {project.current_amount} | Deadline: {new Date(project.deadline / 1000000).toLocaleString()}
              </p>
              {project.status === 'Active' && (
                <div>
                  <input
                    type="number"
                    placeholder="Contribution Amount"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                  />
                  <button onClick={() => handleContribute(project.id)}>Contribute</button>
                </div>
              )}
              {project.status === 'Funded' && project.owner === userPrincipal && (
                <button onClick={() => handleReleaseFunds(project.id)}>Release Funds</button>
              )}
              {project.status === 'Expired' && (
                <button onClick={() => handleClaimRefund(project.id)}>Claim Refund</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
}

export default App;
