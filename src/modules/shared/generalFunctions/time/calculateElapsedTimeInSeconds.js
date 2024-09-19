export function calculateElapsedTimeInSeconds(startTime) {
    const currentTime = new Date();
    return Math.floor((currentTime - new Date(startTime)) / 1000); // in seconds
}