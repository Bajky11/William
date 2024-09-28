import { useMemo } from 'react';

// Jednoduchý hook pro memoizaci filtrů
const useFilter = (filters, dependencies = []) => {
    return useMemo(() => filters, dependencies);
};

export default useFilter;
