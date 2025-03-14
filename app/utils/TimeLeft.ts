export const timeLeftToClaim = (claimedTime: string | number) => {
  const claimedAt = new Date(claimedTime);  
  const nextClaimTime = new Date(claimedAt.getTime() + 60 * 60 * 1000); // +1 hour
  const timeLeft = nextClaimTime.getTime() - Date.now(); // Time left in ms  
  return timeLeft;
};
