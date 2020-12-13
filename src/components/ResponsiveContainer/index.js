import React from 'react';

export default function ResponsiveContainer(props) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '100%', maxWidth: '1260px', margin: '0 auto', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>{props.children}</div>
    </div>
  );
}
