import type { Audio } from "../Player/Player"
import classNames from "classnames"
import { ActionIcon, Slider } from "@mantine/core"
import { SkipBack, SkipForward, Play, Pause, RotateCcw } from "lucide-react"
import { formatDuration, formatTime } from "../../utils"

import styles from "./Footer.module.scss"


interface IProps {
    selectedAudio: Audio | null
    audioRef: React.RefObject<HTMLAudioElement | null>
    isPlaying: boolean
    currentTime: number
    volume: number
    volumeIcon: React.ReactNode
    handlePlay: () => void
    handleRepeat: () => void
    handleVolumeChange: (value: number) => void
    handleVolumeClick: () => void
    handleTimelineChange: (value: number) => void
    handlePrevAudio: () => void
    handleNextAudio: () => void
}

export const Footer = ({
    selectedAudio,
    audioRef,
    isPlaying,
    currentTime,
    volume,
    volumeIcon,
    handlePlay,
    handleRepeat,
    handleVolumeChange,
    handleVolumeClick,
    handleTimelineChange,
    handlePrevAudio,
    handleNextAudio
}: IProps) => {
    return (
        <div className={classNames(styles.footer, !selectedAudio && styles.empty, selectedAudio && styles.playing)}>
            {!selectedAudio && <p>Choose a song to play</p> }
            {selectedAudio && 
            <div className={styles.selectedAudio}>
                <audio ref={audioRef} src={selectedAudio.url} />
                <div className={styles.name}>
                    <h3>{selectedAudio.name}</h3>
                </div>
                <div className={styles.controls}>
                    <div className={styles.block}>
                        <ActionIcon variant='transparent' onClick={handlePrevAudio}><SkipBack /></ActionIcon>
                        <ActionIcon variant='transparent' onClick={handleRepeat}><RotateCcw /></ActionIcon>
                        <ActionIcon variant='transparent' onClick={handlePlay}>
                            {isPlaying ? <Pause /> : <Play />}
                        </ActionIcon>
                        <ActionIcon variant='transparent' onClick={handleNextAudio}><SkipForward /></ActionIcon>
                    </div>
                    <Slider 
                        min={0}
                        max={selectedAudio?.duration || 0}
                        step={0.001}
                        value={currentTime} 
                        onChange={handleTimelineChange} 
                        className={styles.timeline}
                        label={(value) => formatTime(value)}
                    />
                    <div className={styles.block}>
                        <p>{formatDuration(currentTime)}</p>
                        /
                        <p>{formatDuration(selectedAudio?.duration || 0)}</p>
                    </div>
                    <div className={styles.block}>
                        <ActionIcon variant='transparent' onClick={handleVolumeClick}>
                            {volumeIcon}
                        </ActionIcon>
                        <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            value={volume}
                            onChange={handleVolumeChange}
                            styles={{ root: { width: 100 } }} 
                            label={(value) => `${Math.round(value * 100)}%`}
                        />
                    </div>
                </div>
            </div>}
        </div>
    )
}