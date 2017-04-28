import * as types from './actionTypes';

export const setRunnerNotification = (runnerNotification) => {
  return {
    type: types.setRunnerNotification,
    runnerNotification
  };
};
