export const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 
      (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  };
  