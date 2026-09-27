import React, { useState, useContext, useEffect } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import './AudioPlayer.css';

// Client-side sanitizer for speech synthesis
const sanitizeForTTS = (str) => {
  if (!str) return '';
  return str
    .replace(/[#*_\-~`>]/g, '')  // Strip lingering Markdown characters
    .replace(/\s+/g, ' ')        // Clean extra spacing
    .trim();
};

export const AudioPlayer = ({ content }) => {
  const { profile } = useContext(ProfileContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      const naturalVoice = availableVoices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online'))
      ) || availableVoices.find((v) => v.lang.startsWith('en')) || availableVoices[0];

      setSelectedVoice(naturalVoice);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const speechQueue = [];
    if (content.title) {
      speechQueue.push(sanitizeForTTS(content.title));
    }
    
    content.paragraphs.forEach((p, idx) => {
      speechQueue.push(sanitizeForTTS(p));
      if (content.images[idx]) {
        speechQueue.push(`Visual Description: ${sanitizeForTTS(content.images[idx].description)}`);
      }
    });

    speechQueue.forEach((text) => {
      if (!text) return;
      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) utterance.voice = selectedVoice;
      utterance.rate = profile.speechRate;

      utterance.onend = () => {
        if (!window.speechSynthesis.speaking) {
          setIsPlaying(false);
          setIsPaused(false);
        }
      };

      window.speechSynthesis.speak(utterance);
    });

    setIsPlaying(true);
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="audio-player-bar">
      <span>Audio Assistant:</span>
      
      {voices.length > 0 && (
        <select
          value={selectedVoice?.name || ''}
          onChange={(e) => setSelectedVoice(voices.find((v) => v.name === e.target.value))}
          style={{ padding: '6px', borderRadius: '4px' }}
        >
          {voices
            .filter((v) => v.lang.startsWith('en'))
            .map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
        </select>
      )}

      {!isPlaying ? (
        <button className="audio-btn play" onClick={handlePlay}>Play Speech</button>
      ) : (
        <button className="audio-btn pause" onClick={handlePause}>Pause</button>
      )}
      <button className="audio-btn stop" onClick={handleStop}>Stop</button>
    </div>
  );
};