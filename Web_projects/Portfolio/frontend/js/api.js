/**
 * Centralny klient HTTP API.
 */

const API_BASE = "http://127.0.0.1:8000/api";

let authToken = null;
let onUnauthorizedCallback = null;
let onApiErrorCallback = null;
let onApiRecoveredCallback = null;

export function setToken(token) {
  authToken = token;
}

export function getToken() {
  return authToken;
}

export function clearToken() {
  authToken = null;
}

export function onUnauthorized(callback) {
  onUnauthorizedCallback = callback;
}

export function onApiError(callback) {
  onApiErrorCallback = callback;
}

export function onApiRecovered(callback) {
  onApiRecoveredCallback = callback;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = { ...(options.headers || {}) };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  if (
    options.body
    && !(options.body instanceof FormData)
    && !(options.body instanceof URLSearchParams)
  ) {
    headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      credentials: "include"
    });
  } catch {
    const error = new Error(
      "Brak łączności z serwerem API. Upewnij się, że backend jest uruchomiony."
    );
    if (typeof onApiErrorCallback === "function") {
      onApiErrorCallback(error);
    }
    throw error;
  }

  if (typeof onApiRecoveredCallback === "function") {
    onApiRecoveredCallback();
  }

  if (response.status === 401 && endpoint !== "/auth/login") {
    clearToken();
    if (typeof onUnauthorizedCallback === "function") {
      onUnauthorizedCallback();
    }
  }

  return response;
}

export const authApi = {
  async register(username, password) {
    const res = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || "Błąd podczas rejestracji użytkownika.");
    }
    return data;
  },

  async login(username, password) {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    const res = await request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || "Niepoprawny login lub hasło.");
    }
    return data;
  },

  async logout() {
    try {
      await request("/auth/logout", { method: "POST" });
    } catch {
      // Stan lokalny sesji musi zostać wyczyszczony także przy braku API.
    }
    clearToken();
  },

  async getMe() {
    const res = await request("/auth/me");
    if (res.status === 401) {
      return null;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || "Nie udało się sprawdzić sesji użytkownika.");
    }
    return await res.json().catch(() => null);
  }
};

export const linksApi = {
  async getAll() {
    const res = await request("/links");
    const data = await res.json().catch(() => []);
    if (!res.ok) {
      throw new Error(data.detail || "Nie udało się pobrać odnośników.");
    }
    return data;
  },

  async create(linkData) {
    const res = await request("/links", {
      method: "POST",
      body: JSON.stringify(linkData)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.detail || "Nie udało się zapisać odnośnika.");
    }
    return data;
  },

  async delete(linkId) {
    const res = await request(`/links/${encodeURIComponent(linkId)}`, {
      method: "DELETE"
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || "Nie udało się usunąć odnośnika.");
    }
    return true;
  }
};
