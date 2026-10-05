import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;
const MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

const subscribe = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia(MEDIA_QUERY);

  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
  };
};

const getSnapshot = () => {
  return window.matchMedia(MEDIA_QUERY).matches;
};

const getServerSnapshot = () => false;

export function useIsMobile() {
  return useSyncExternalStore(
      subscribe,
      getSnapshot,
      getServerSnapshot
  );
}