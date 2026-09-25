import './OpportunityMatrix.css';
import Badge from './Badge';

const OpportunityMatrix = ({ matrix }) => {
  if (!matrix || matrix.length === 0) {
    return (
      <div className="matrix-empty panel">
        <p>No opportunity data available. Please run the backend pipeline.</p>
      </div>
    );
  }

  return (
    <div className="matrix-container panel">
      <div className="matrix-header">
        <h2>Prioritized Opportunities</h2>
        <p>Based on frequency and clustering of validated user complaints.</p>
      </div>
      
      <div className="matrix-table-wrapper">
        <table className="matrix-table">
          <thead>
            <tr>
              <th>Priority</th>
              <th>Failure State</th>
              <th>Frequency (Volume)</th>
              <th>Core Issue Pattern</th>
            </tr>
          </thead>
          <tbody>
            {matrix.map((item, index) => (
              <tr key={item.cluster_id} className="matrix-row">
                <td className="priority-col">#{index + 1}</td>
                <td><Badge state={item.failure_state} /></td>
                <td className="freq-col">
                  <div className="freq-bar-container">
                    <div 
                      className="freq-bar" 
                      style={{ width: `${Math.min(100, item.frequency * 5)}%` }}
                    ></div>
                    <span>{item.frequency}</span>
                  </div>
                </td>
                <td className="desc-col">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpportunityMatrix;
