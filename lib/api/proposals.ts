// API client for proposal operations

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types
export interface GroupMember {
  student_id: number;
  name: string;
  email: string;
}

export interface AdvisorInfo {
  name: string;
  email: string;
}

export interface GroupInfo {
  group_id: number;
  group_name: string;
  member_count: number;
  members?: GroupMember[];
  advisor?: AdvisorInfo | null;
}

export interface GroupInfoResponse {
  has_group: boolean;
  can_submit: boolean;
  has_proposal?: boolean;
  proposal_status?: string | null;
  group?: GroupInfo;
  message: string;
}

export interface ProposalResponse {
  project_id: number;
  group_id: number;
  group_name: string;
  project_name: string;
  project_description: string;
  proposal_status: string;
  tech_stack: string;
  domain: string;
  proposal_document: string | null;
  advisor_name: string | null;
  advisor_remarks: string | null;
  director_remarks: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
  member_count: number;
  members: GroupMember[];
  can_edit: boolean;
}

export interface ProposalCreateData {
  project_name: string;
  project_description: string;
  tech_stack: string;
  domain: string;
  proposal_document?: File | null;
}

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

// Get auth headers for FormData
const getAuthHeadersForFormData = () => {
  const token = getAuthToken();
  return {
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Get all proposals for the student's group
export const getStudentProposals = async (): Promise<ProposalResponse[]> => {
  // Check if token exists
  const token = getAuthToken();
  if (!token) {
    throw new Error('You are not logged in. Please login first.');
  }

  const response = await fetch(`${API_BASE_URL}/api/projects/student/proposals/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      throw new Error('Your session has expired. Please logout and login again.');
    }

    let error;
    try {
      error = await response.json();
    } catch {
      throw new Error(`Failed to fetch proposals: ${response.status} ${response.statusText}`);
    }
    throw new Error(error.error || error.detail || 'Failed to fetch proposals');
  }

  const data = await response.json();
  return data.proposals;
};

// Get group info for proposal form
export const getGroupInfo = async (): Promise<GroupInfoResponse> => {
  // Check if token exists
  const token = getAuthToken();
  if (!token) {
    throw new Error('You are not logged in. Please login first.');
  }

  const response = await fetch(`${API_BASE_URL}/api/projects/student/proposals/group-info/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      throw new Error('Your session has expired. Please logout and login again.');
    }

    let error;
    try {
      error = await response.json();
    } catch {
      throw new Error(`Failed to fetch group info: ${response.status} ${response.statusText}`);
    }
    throw new Error(error.error || error.detail || 'Failed to fetch group info');
  }

  return await response.json();
};

// Get specific proposal details
export const getProposalDetail = async (proposalId: number): Promise<ProposalResponse> => {
  // Check if token exists
  const token = getAuthToken();
  if (!token) {
    throw new Error('You are not logged in. Please login first.');
  }

  const response = await fetch(`${API_BASE_URL}/api/projects/student/proposals/${proposalId}/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      throw new Error('Your session has expired. Please logout and login again.');
    }

    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch proposal details');
  }

  const data = await response.json();
  return data.proposal;
};

// Create a new proposal
export const createProposal = async (proposalData: ProposalCreateData): Promise<ProposalResponse> => {
  // Check if token exists
  const token = getAuthToken();
  if (!token) {
    throw new Error('You are not logged in. Please login first.');
  }

  let body: any;
  let headers: any;

  if (proposalData.proposal_document) {
    // Use FormData for file upload
    const formData = new FormData();
    formData.append('project_name', proposalData.project_name);
    formData.append('project_description', proposalData.project_description);
    formData.append('tech_stack', proposalData.tech_stack);
    formData.append('domain', proposalData.domain);
    formData.append('proposal_document', proposalData.proposal_document);
    
    body = formData;
    headers = getAuthHeadersForFormData();
  } else {
    // Use JSON for data without file
    body = JSON.stringify({
      project_name: proposalData.project_name,
      project_description: proposalData.project_description,
      tech_stack: proposalData.tech_stack,
      domain: proposalData.domain,
    });
    headers = getAuthHeaders();
  }

  const response = await fetch(`${API_BASE_URL}/api/projects/student/proposals/create/`, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      throw new Error('Your session has expired. Please logout and login again.');
    }

    const error = await response.json();
    throw new Error(error.errors ? JSON.stringify(error.errors) : 'Failed to create proposal');
  }

  const data = await response.json();
  return data.proposal;
};

// Update an existing proposal
export const updateProposal = async (proposalId: number, proposalData: Partial<ProposalCreateData>): Promise<ProposalResponse> => {
  // Check if token exists
  const token = getAuthToken();
  if (!token) {
    throw new Error('You are not logged in. Please login first.');
  }

  let body: any;
  let headers: any;

  if (proposalData.proposal_document) {
    // Use FormData for file upload
    const formData = new FormData();
    if (proposalData.project_name) formData.append('project_name', proposalData.project_name);
    if (proposalData.project_description) formData.append('project_description', proposalData.project_description);
    if (proposalData.tech_stack) formData.append('tech_stack', proposalData.tech_stack);
    if (proposalData.domain) formData.append('domain', proposalData.domain);
    formData.append('proposal_document', proposalData.proposal_document);
    
    body = formData;
    headers = getAuthHeadersForFormData();
  } else {
    // Use JSON for data without file
    const jsonData: any = {};
    if (proposalData.project_name) jsonData.project_name = proposalData.project_name;
    if (proposalData.project_description) jsonData.project_description = proposalData.project_description;
    if (proposalData.tech_stack) jsonData.tech_stack = proposalData.tech_stack;
    if (proposalData.domain) jsonData.domain = proposalData.domain;
    
    body = JSON.stringify(jsonData);
    headers = getAuthHeaders();
  }

  const response = await fetch(`${API_BASE_URL}/api/projects/student/proposals/${proposalId}/`, {
    method: 'PUT',
    headers,
    body,
  });

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      throw new Error('Your session has expired. Please logout and login again.');
    }

    const error = await response.json();
    throw new Error(error.errors ? JSON.stringify(error.errors) : 'Failed to update proposal');
  }

  const data = await response.json();
  return data.proposal;
};

// Delete a proposal
export const deleteProposal = async (proposalId: number): Promise<void> => {
  // Check if token exists
  const token = getAuthToken();
  if (!token) {
    throw new Error('You are not logged in. Please login first.');
  }

  const response = await fetch(`${API_BASE_URL}/api/projects/student/proposals/${proposalId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      throw new Error('Your session has expired. Please logout and login again.');
    }

    const error = await response.json();
    throw new Error(error.error || 'Failed to delete proposal');
  }
};

// Submit a proposal (change status from DRAFT to SUBMITTED)
export const submitProposal = async (proposalId: number): Promise<ProposalResponse> => {
  // Check if token exists
  const token = getAuthToken();
  if (!token) {
    throw new Error('You are not logged in. Please login first.');
  }

  const response = await fetch(`${API_BASE_URL}/api/projects/student/proposals/${proposalId}/submit/`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      throw new Error('Your session has expired. Please logout and login again.');
    }

    const error = await response.json();
    throw new Error(error.errors ? JSON.stringify(error.errors) : 'Failed to submit proposal');
  }

  const data = await response.json();
  return data.proposal;
};
