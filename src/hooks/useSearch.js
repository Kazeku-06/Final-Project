import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const useSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  // Update URL 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        setSearchParams({ q: searchTerm });
      } else {
        setSearchParams({});
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, setSearchParams]);

  // Sync searchTerm 
  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchTerm(query);
  }, [searchParams]);

  return {
    searchTerm,
    setSearchTerm,
    query: searchParams.get('q') || ''
  };
};

export default useSearch;