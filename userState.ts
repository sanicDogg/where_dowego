type UserState = 'idle' | 'removing' | 'adding';
export const userStates = new Map<number, UserState>();

export const setUserState = (userId: number, state: UserState) => {
  userStates.set(userId, state);
};
