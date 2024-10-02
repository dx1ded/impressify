export * from "./presentationSlice"
export * from "./recentPresentationsSlice"

/* I decided to define these in entities/presentation because:
  1) They are implicitly connected to presentation itself (you basically use it only on that page)
  2) ElementWrapper.ts (which is in entities/presentation/ui) uses actions from toolbar, so I can't split it into different entities
*/
export * from "./toolbarSlice"
export * from "./historySlice"
