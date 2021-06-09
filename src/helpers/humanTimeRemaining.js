const humanTimeRemaining = function( timeRemainingInMillis ){
  if( timeRemainingInMillis > 0 ){
    const days = Math.floor( timeRemainingInMillis / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemainingInMillis / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeRemainingInMillis / 1000 / 60) % 60);
    const seconds = Math.floor((timeRemainingInMillis / 1000) % 60);

    return `-${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  return false;
}

export default humanTimeRemaining;