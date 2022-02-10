import * as TYPES from "./types";

export function updateUnmountState(state) {
  return {
    type: TYPES.UPDATE_UNMOUNT_STATE,
    payload: state
  };
}
