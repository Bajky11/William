import {calculateElapsedTimeInSeconds} from "@/modules/shared/generalFunctions/time/calculateElapsedTimeInSeconds";
import {secondsToHHMMSS} from "@/modules/shared/generalFunctions/time/secondsToHHMMSS";

export function calculateElapsedTime(timeLog) {
    let elapsedSecondsTotal = 0;
    if(timeLog?.start){
        const elapsedSecondsFromStart = calculateElapsedTimeInSeconds(timeLog.start)
        elapsedSecondsTotal += elapsedSecondsFromStart;
    }
    elapsedSecondsTotal += timeLog.elapsed;
    return secondsToHHMMSS(elapsedSecondsTotal);
}