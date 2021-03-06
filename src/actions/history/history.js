/**
 * History actions.
 * @module actions/history/history
 */

import { GET_HISTORY, REVERT_HISTORY } from '../../constants/ActionTypes';

/**
 * Get history function.
 * @function getHistory
 * @param {string} url Content url.
 * @returns {Object} Get history action.
 */
export function getHistory(url) {
  return {
    type: GET_HISTORY,
    promise: api => api.get(`${url}/@history`),
  };
}

/**
 * Revert history function.
 * @function revertHistory
 * @param {string} url Content url.
 * @param {number} version Revert version.
 * @returns {Object} Revet history action.
 */
export function revertHistory(url, version) {
  return {
    type: REVERT_HISTORY,
    promise: api => api.patch(`${url}/@history`, { data: { version } }),
  };
}
