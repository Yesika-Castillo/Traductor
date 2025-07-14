import React from 'react';
import './VoiceWave.css';

const VoiceWave: React.FC = () => (
  <div className="voice-wave">
    <svg width="120" height="40" viewBox="0 0 120 40">
      <rect className="bar" x="5" width="10" y="10" height="20" rx="5" />
      <rect className="bar" x="20" width="10" y="5" height="30" rx="5" />
      <rect className="bar" x="35" width="10" y="15" height="10" rx="5" />
      <rect className="bar" x="50" width="10" y="8" height="24" rx="5" />
      <rect className="bar" x="65" width="10" y="12" height="16" rx="5" />
      <rect className="bar" x="80" width="10" y="6" height="28" rx="5" />
      <rect className="bar" x="95" width="10" y="13" height="14" rx="5" />
    </svg>
  </div>
);

export default VoiceWave; 