import React, { useCallback, useEffect, useMemo, useState } from 'react';

function ResourcePage({ title, endpointName }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiHost = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
  const apiUrl = `${apiHost}/api/${endpointName}/`;

  const normalizeData = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.results)) return data.results;
    if (data && typeof data === 'object') return [data];
    return [];
  };

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    console.log(`[${title}] API endpoint:`, apiUrl);

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to fetch ${endpointName}: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(`[${title}] fetched data:`, data);
        setItems(normalizeData(data));
      })
      .catch((fetchError) => {
        console.error(`[${title}] fetch error:`, fetchError);
        setError(fetchError.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiUrl, endpointName, title]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tableHeaders = useMemo(() => {
    const headers = new Set();
    items.forEach((item) => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        Object.keys(item).forEach((key) => headers.add(key));
      }
    });
    return Array.from(headers);
  }, [items]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(term),
    );
  }, [items, searchTerm]);

  const formatCell = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const openDetails = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedItem(null);
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-white d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <h1 className="h4 mb-1">{title}</h1>
          <p className="mb-0 text-muted">
            Endpoint:&nbsp;
            <a className="link-primary" href={apiUrl} target="_blank" rel="noreferrer">
              {apiUrl}
            </a>
          </p>
        </div>
        <div className="btn-group">
          <button type="button" className="btn btn-primary" onClick={fetchData}>
            Refresh
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        </div>
      </div>

      <div className="card-body">
        <form className="row gx-2 gy-2 align-items-end mb-4">
          <div className="col-sm-8 col-md-6">
            <label htmlFor="resourceSearch" className="form-label">
              Filter {title}
            </label>
            <input
              id="resourceSearch"
              type="search"
              className="form-control"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="col-sm-4 col-md-3">
            <label className="form-label">Results</label>
            <div className="form-control-plaintext mt-1">{filteredItems.length} / {items.length}</div>
          </div>
        </form>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <>
            {filteredItems.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      {tableHeaders.map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, rowIndex) => (
                      <tr key={item.id ?? rowIndex}>
                        {tableHeaders.map((header) => (
                          <td key={header}>
                            <span>{formatCell(item?.[header])}</span>
                          </td>
                        ))}
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openDetails(item)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-warning">No data available for {title.toLowerCase()}.</div>
            )}
          </>
        )}
      </div>

      {showDetails && selectedItem && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{title} Details</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeDetails} />
                </div>
                <div className="modal-body">
                  <pre className="bg-light p-3 rounded">{JSON.stringify(selectedItem, null, 2)}</pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeDetails}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
}

export default ResourcePage;
