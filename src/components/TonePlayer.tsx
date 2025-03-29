import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { getVoiceForTone } from '@/lib/voiceMappings';
import { ElevenLabsService } from '@/lib/elevenLabsService';
import { PlayIcon, PauseIcon, Loader2Icon } from 'lucide-react';

interface TonePlayerProps {
  text: string;
  tone: string;
  apiKey: string;
}

export function TonePlayer({ text, tone, apiKey }: TonePlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const elevenLabsService = useRef(new ElevenLabsService(apiKey));

  useEffect(() => {
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = async () => {
    try {
      setError(null);
      
      // If we already have audio loaded, just play/pause it
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
        return;
      }

      // Otherwise, generate new audio
      setIsLoading(true);
      const voiceConfig = getVoiceForTone(tone);
      const audioData = await elevenLabsService.current.textToSpeech(text, voiceConfig);
      
      const audio = ElevenLabsService.createAudioElement(audioData);
      
      // Set up audio event handlers
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.onplay = () => {
        setIsPlaying(true);
      };
      
      audio.onpause = () => {
        setIsPlaying(false);
      };

      audioRef.current = audio;
      audio.play();
      setIsPlaying(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate speech');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handlePlay}
        disabled={isLoading}
        variant="outline"
        className="w-full max-w-xs"
      >
        {isLoading ? (
          <Loader2Icon className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <PauseIcon className="h-4 w-4" />
        ) : (
          <PlayIcon className="h-4 w-4" />
        )}
        <span className="ml-2">
          {isLoading ? 'Generating...' : isPlaying ? 'Pause' : 'Play in ' + tone + ' tone'}
        </span>
      </Button>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
} 