import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import { AIChatbot } from './components/wander/AIChatbot';
import { useEffect, useState } from 'react';

export default function App() {
  const [isChatPage, setIsChatPage] = useState(
    typeof window !== "undefined" && window.location.pathname === "/chat"
  );

  useEffect(() => {
    const check = () => setIsChatPage(window.location.pathname === "/chat");
    window.addEventListener("popstate", check);
    // Also observe navigation via a MutationObserver on pathname
    const id = setInterval(check, 300);
    return () => { window.removeEventListener("popstate", check); clearInterval(id); };
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      {!isChatPage && <AIChatbot />}
    </>
  );
}