/**
 * Profile API Service
 * Handles all profile-related API calls with proper authentication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

/**
 * Get authentication token from localStorage.
 * Supports both the new key ("nextq_jwt") and the legacy key ("access_token").
 */
const getAuthToken = (): string | null => {
  return (
    localStorage.getItem("nextq_jwt") ||
    localStorage.getItem("access_token") ||
    null
  );
};

/**
 * Get user data from localStorage.
 * Returns null gracefully — the new auth flow stores user data in React context,
 * not localStorage, so this is a no-op stub for legacy components.
 */
export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

/**
 * Update stored user data in localStorage
 */
export const updateStoredUser = (userData: any) => {
  const currentUser = getStoredUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }
};

/**
 * Fetch user profile from API
 */
export const fetchUserProfile = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Authentication expired");
    }
    throw new Error("Failed to fetch profile");
  }

  const data = await response.json();
  return data.user;
};

/**
 * Update user profile (without image)
 */
export const updateUserProfile = async (profileData: {
  first_name?: string;
  last_name?: string;
  bio?: string;
  cgpa?: string;
  major?: string;
  contact_number?: string;
  tech_skills?: string[];
  project_preferences?: any;
}) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/auth/profile/update/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data;
};

/**
 * Update user profile with image upload
 * Uses FormData for multipart/form-data submission
 */
export const updateUserProfileWithImage = async (
  profileData: {
    first_name?: string;
    last_name?: string;
    bio?: string;
    cgpa?: string;
    major?: string;
    contact_number?: string;
    tech_skills?: string[];
    project_preferences?: any;
  },
  imageFile?: File
) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const formData = new FormData();

  // Append text fields
  Object.entries(profileData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "object") {
        // Convert arrays and objects to JSON strings
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  // Append image file if provided
  if (imageFile) {
    formData.append("profile_image", imageFile);
  }

  const response = await fetch(`${API_BASE_URL}/auth/profile/update/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      // Don't set Content-Type - browser will set it with boundary for FormData
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data;
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  const token = getAuthToken();
  const refreshToken = localStorage.getItem("refresh_token");

  if (refreshToken) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    } catch (error) {
      console.error("Logout API error:", error);
    }
  }

  // Clear all auth data from localStorage
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
