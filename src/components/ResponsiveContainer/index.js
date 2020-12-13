import React from 'react';

export default function ResponsiveContainer(props) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>{props.children}</div>
    </div>
  );
}
