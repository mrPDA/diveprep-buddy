/** Visual content studio (local only). */
export const isContentStudio = import.meta.env.VITE_CONTENT_STUDIO === 'true'

/** Admin UI — dev or content studio, never production deploy. */
export const isAdminEnabled = import.meta.env.DEV || isContentStudio
