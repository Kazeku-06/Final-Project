import { useState, useEffect } from 'react';
import SearchView from './SearchView';
import { api } from '../../services/api';
import SkeletonLoader from '../../components/SkeletonLoader';
import useSearch from '../../hooks/useSearch';

const Search = () => {
  const { query } = useSearch();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    const searchItems = async () => {
      if (!query.trim()) {
        setResults([]);
        setPagination({ currentPage: 1, totalPages: 1 });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await api.searchAll(query, 1);
        
        setResults(data.results || []);
        setPagination({
          currentPage: 1,
          totalPages: Math.min(data.total_pages || 1, 500)
        });
      } catch (err) {
        setError(err.message);
        setResults([]);
        setPagination({ currentPage: 1, totalPages: 1 });
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchItems, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle pagination
  const handlePageChange = async (page) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const data = await api.searchAll(query, page);
      
      setResults(data.results || []);
      setPagination({
        currentPage: page,
        totalPages: Math.min(data.total_pages || 1, 500)
      });
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && results.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SkeletonLoader type="card" count={8} />
      </div>
    );
  }

  return (
    <SearchView 
      results={results}
      loading={loading}
      query={query}
      error={error}
      pagination={pagination}
      onPageChange={handlePageChange}
    />
  );
};

export default Search;