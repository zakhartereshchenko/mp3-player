import { useState, useCallback, useEffect } from 'react'
import { Dropzone } from '../Dropzone/Dropzone'
import { usePlayer } from '../../hooks/usePlayer'
import { SongsList } from '../SongsList/SongsList'
import { Footer } from '../Footer/Footer'

import styles from './Player.module.scss'

export interface Audio{
    id: string,
    url: string
    name: string
    size: number
    duration: number
}

export const Player = () => {
    const [files, setFiles] = useState<Audio[] | null>(null)

    const {
        audioRef,
        selectedAudio, 
        isPlaying, 
        currentTime, 
        volume, 
        volumeIcon, 
        handlePlay, 
        handleRepeat, 
        handleVolumeChange, 
        handleVolumeClick, 
        handleSelect,
        handleTimelineChange,
        handleReset
    } = usePlayer()

    const handleDrop = useCallback((acceptedFiles: Audio[]) => {
        setFiles(prev => prev ? [...prev, ...acceptedFiles] : acceptedFiles)
    }, [])

    const handleDelete = useCallback((id: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setFiles(prev => prev?.filter((file) => file.id !== id) || null)
    }, [])

    const handleNextAudio = useCallback(() => {
        if (!selectedAudio || !files || files.length === 0) return;

        const currentIndex = files.findIndex(file => file.id === selectedAudio.id);
        
        const nextIndex = (currentIndex + 1) % files.length;

        handleSelect(files[nextIndex]);
    }, [selectedAudio, files, handleSelect]);

    const handlePrevAudio = useCallback(() => {
        if (!selectedAudio || !files || files.length === 0) return;

        const currentIndex = files.findIndex(file => file.id === selectedAudio.id);
        
        const nextIndex = (currentIndex - 1 + files.length) % files.length;

        handleSelect(files[nextIndex]);
    }, [selectedAudio, files, handleSelect]);

    useEffect(()=>{
        if(currentTime === selectedAudio?.duration){
            setTimeout(()=>{
                handleNextAudio();
            }, 500)
        }
    },[currentTime, selectedAudio, handleNextAudio])

    useEffect(() => {
        if (!selectedAudio) return;

        const stillExists = files?.some(p => p.id === selectedAudio.id);

        if (!stillExists) {
            handleReset();
        }
    }, [files, selectedAudio, handleReset]);

    return (
        <div className={styles.container}>
            <Dropzone onAccept={handleDrop} />
            <SongsList files={files} selectedAudio={selectedAudio} isPlaying={isPlaying} handleSelect={handleSelect} handleDelete={handleDelete}/>
            <Footer 
                selectedAudio={selectedAudio}
                audioRef={audioRef}
                isPlaying={isPlaying}
                currentTime={currentTime}
                volume={volume}
                volumeIcon={volumeIcon}
                handlePlay={handlePlay}
                handleRepeat={handleRepeat}
                handleVolumeChange={handleVolumeChange}
                handleVolumeClick={handleVolumeClick}
                handleTimelineChange={handleTimelineChange}
                handlePrevAudio={handlePrevAudio}
                handleNextAudio={handleNextAudio}
            />
        </div>
    )
}