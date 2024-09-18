import { useMemo } from "react";

export const useReduxValueAfterLoad = (initialValue, reduxValue, assignFunc) => {
    const value = useMemo(() => {
        if (reduxValue) {
            return assignFunc(reduxValue);
        } else {
            return initialValue;
        }
    }, [reduxValue, assignFunc, initialValue]);

    return { value };
};
