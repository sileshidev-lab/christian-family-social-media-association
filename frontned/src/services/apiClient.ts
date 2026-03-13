export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5050";

const TOKEN_KEY = "cfsmcca_admin_token";

export const getAuthToken = () =>
  typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY);

const notifyAuthChange = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("cfsmcca-auth"));
};

export const setAuthToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
  notifyAuthChange();
};

export class ApiError extends Error {
  status: number;
  data?: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export const apiFetch = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { auth, headers, ...rest } = options;
  const token = auth ? getAuthToken() : null;
  const hasFormData = rest.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(hasFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    }
  });

  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      setAuthToken(null);
    }
    const message =
      typeof data === "string"
        ? data
        : (data as { error?: string })?.error ?? "Request failed";
    throw new ApiError(message, response.status, data);
  }

  return data as T;
};
