import { AuthClient } from '@dfinity/auth-client';

let authClient = null;

// Initialize the AuthClient
async function initAuthClient() {
  if (!authClient) {
    authClient = await AuthClient.create();
  }
}

// Function to log in using Internet Identity
async function login() {
  await initAuthClient();
  try {
    await authClient.login({
      identityProvider: 'https://identity.icp0.io',
      onSuccess: () => {
        const identity = authClient.getIdentity();
        console.log('Logged in as:', identity);
        // Set user identity globally or store in localStorage to maintain session
        localStorage.setItem('identity', JSON.stringify(identity));
      },
    });
  } catch (err) {
    console.error('Login failed:', err);
  }
}

// Function to log out
async function logout() {
  await initAuthClient();
  authClient.logout();
  localStorage.removeItem('identity');
  console.log('Logged out');
}

// Function to get the currently authenticated user
function getAuthenticatedIdentity() {
  const identity = localStorage.getItem('identity');
  return identity ? JSON.parse(identity) : null;
}

// Function to check if the user is authenticated
function isAuthenticated() {
  return getAuthenticatedIdentity() !== null;
}

export async function getIdentity() {
    if (!authClient) {
      authClient = await AuthClient.create();
    }
  
    return await authClient.getIdentity();
  }
  
  export async function getPrincipal() {
    if (!authClient) {
      authClient = await AuthClient.create();
    }
    
    return authClient.getPrincipal();
  }

export { login, logout, isAuthenticated, getAuthenticatedIdentity };
