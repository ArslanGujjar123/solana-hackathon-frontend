// API client for Groups functionality
// import type {
//   GroupResponse,
//   AvailableStudentsResponse,
//   InvitationsResponse,
//   SendInvitationsResponse,
//   RespondInvitationResponse,
// } from '@/lib/types/groups';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// async function fetchWithAuth(url: string, options: RequestInit = {}) {
//   const token = localStorage.getItem('access_token');
  
//   const headers = {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//     ...options.headers,
//   };

//   const response = await fetch(url, {
//     ...options,
//     headers,
//   });

//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ message: 'Network error' }));
//     throw new Error(error.message || `HTTP error! status: ${response.status}`);
//   }

//   return response.json();
// }

// Get current student's group
// export async function getMyGroup(): Promise<GroupResponse> {
//   return fetchWithAuth(`${API_BASE_URL}/api/groups/my-group/`);
// }

// Create a new group
// export async function createGroup(groupName: string): Promise<GroupResponse> {
//   return fetchWithAuth(`${API_BASE_URL}/api/groups/create/`, {
//     method: 'POST',
//     body: JSON.stringify({ group_name: groupName }),
//   });
// }

// Get available students (not in any group)
// export async function getAvailableStudents(): Promise<AvailableStudentsResponse> {
//   return fetchWithAuth(`${API_BASE_URL}/api/groups/available-students/`);
// }

// Send invitations to students
// export async function sendInvitations(
//   studentIds: number[],
//   message?: string
// ): Promise<SendInvitationsResponse> {
//   return fetchWithAuth(`${API_BASE_URL}/api/groups/invite/`, {
//     method: 'POST',
//     body: JSON.stringify({
//       student_ids: studentIds,
//       message: message || '',
//     }),
//   });
// }

// Get my pending invitations
// export async function getMyInvitations(): Promise<InvitationsResponse> {
//   return fetchWithAuth(`${API_BASE_URL}/api/groups/invitations/`);
// }

// Respond to an invitation (accept or reject)
// export async function respondToInvitation(
//   invitationId: number,
//   action: 'accept' | 'reject'
// ): Promise<RespondInvitationResponse> {
//   return fetchWithAuth(
//     `${API_BASE_URL}/api/groups/invitations/${invitationId}/respond/`,
//     {
//       method: 'POST',
//       body: JSON.stringify({ action }),
//     }
//   );
// }

// Leave group
// export async function leaveGroup(): Promise<{ success: boolean; message: string }> {
//   return fetchWithAuth(`${API_BASE_URL}/api/groups/leave/`, {
//     method: 'POST',
//   });
// }
