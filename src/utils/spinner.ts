import { spinner as createSpinner } from '@clack/prompts';

/**
 * Unified terminal spinner management
 */
export function spinner() {
  const s = createSpinner();
  
  return {
    /**
     * Start the loading animation
     */
    start(message: string) {
      s.start(message);
    },

    /**
     * Stop the animation
     * @param msg Message to display upon stopping
     * @param _code Compatibility parameter for existing calls
     */
    stop(msg: string, _code: number = 0) {
      s.stop(msg);
    },

    /**
     * Stop with a success status
     */
    succeed(msg: string) {
      s.stop(msg);
    },

    /**
     * Stop with a failure status
     */
    fail(msg: string) {
      s.stop(msg);
    }
  };
}
