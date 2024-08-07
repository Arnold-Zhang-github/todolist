export const getApiUrl = () => {
   return (
      process.env.NEXT_PUBLIC_API_URL ||
      "https://todolist-3i74-afnekg82e-arnolds-projects-1b67b508.vercel.app/"
   );
};
