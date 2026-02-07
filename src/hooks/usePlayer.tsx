import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { Volume, Volume1, Volume2, VolumeOff, VolumeX } from 'lucide-react'
import type { Audio } from '../components/Player/Player'

export const usePlayer = () => {
    const [selectedAudio, setSelectedAudio] = useState<Audio | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    if (!audioRef.current) {
        audioRef.current = new Audio();
    }

    const handleReset = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        audio.load();

        setCurrentTime(0);
        setIsPlaying(false);
        setSelectedAudio(null);
    }, []);

    const handlePlay = useCallback(() => {
        if (!selectedAudio) return;
        setIsPlaying(prev => !prev);
    }, [selectedAudio]);

    const handleSelect = useCallback((file: Audio) => {
        if(selectedAudio?.id === file.id){
            handlePlay();
            return;
        }
        setSelectedAudio(file);
        setIsPlaying(true);
    }, [handlePlay]);

    const handleTimelineChange = useCallback((value: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value;
            setCurrentTime(value);
        }
    }, []);

    const handleRepeat = useCallback(() => {
        const audio = audioRef.current;
        if (!selectedAudio || !audio) return;
        
        audio.currentTime = 0;
        setCurrentTime(0);
        setIsPlaying(true);
    }, [selectedAudio]);

    const handleVolumeChange = useCallback((value: number) => {
        setVolume(value);
    }, []);

    const handleVolumeClick = useCallback(() => {
        setIsMuted(prev => !prev);
    }, []);

    const volumeIcon = useMemo(()=>{
        if(isMuted) return <VolumeOff />
        if(volume === 0) return <VolumeX />
        if(volume < 0.2) return <Volume />
        if(volume < 0.6) return <Volume1 />
        return <Volume2 />
    },[volume, isMuted])

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !selectedAudio) return;

        audio.src = selectedAudio.url;
        audio.load();
        setCurrentTime(0);

        if (isPlaying) {
            audio.play()
        }
    }, [selectedAudio])

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !selectedAudio) return;

        if (isPlaying) {
            audio.play()
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
        };

        audio.removeEventListener('timeupdate', updateTime);
        audio.addEventListener('timeupdate', updateTime);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
        };
    }, [selectedAudio]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    return {
        audioRef,
        selectedAudio,
        isPlaying,
        currentTime,
        volume,
        isMuted,
        volumeIcon,
        handlePlay,
        handleRepeat,
        handleVolumeChange,
        handleVolumeClick,
        handleTimelineChange,
        handleSelect,
        handleReset,
    }
}