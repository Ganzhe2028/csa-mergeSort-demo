/**
 * Pauses execution for a specified number of milliseconds.
 * Useful for visualizing algorithms step-by-step.
 * @param ms Duration to sleep in milliseconds
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
