'use client';
import { useState } from 'react';
export default function ChatPage() {
  const [message, setMessage] = useState('');
  return (
    <div style={{ padding: '24px' }}>
      <h1>Lithi Assistant</h1>
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ padding: '10px', width: '300px' }}
        />
        <button style={{ padding: '10px 20px', marginLeft: '10px' }}>Send</button>
      </div>
    </div>
  );
}
