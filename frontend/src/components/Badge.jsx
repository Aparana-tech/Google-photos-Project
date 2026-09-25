import './Badge.css';

const Badge = ({ state }) => {
  let colorClass = 'gray';
  
  if (state.includes('Temporal')) colorClass = 'blue';
  if (state.includes('Spatial')) colorClass = 'green';
  if (state.includes('Sensory')) colorClass = 'yellow';
  
  return (
    <span className={`badge badge-${colorClass}`}>
      {state}
    </span>
  );
};

export default Badge;
