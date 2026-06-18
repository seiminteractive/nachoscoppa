import { useCollection, useDoc } from "./useFirestore";

export const useTracks = () => useCollection("tracks", { order: "order" });
export const useFeaturedTrack = () => useDoc("featuredTrack/main");
export const useLabels = () => useCollection("labels", { order: "order" });
export const usePressNotes = () => useCollection("pressNotes", { order: "order" });
export const useLiveSets = () => useCollection("liveSets", { order: "order" });
export const useAgendaEvents = () => useCollection("agendaEvents", { order: "date" });
export const useSiteStats = () => useDoc("siteStats/main");
export const useInstagramPosts = () =>
  useCollection("instagramPosts", { order: "takenAt", direction: "desc" });
export const useInstagramMeta = () => useDoc("sync/instagram");
