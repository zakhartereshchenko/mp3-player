import type { Audio } from "../Player/Player"
import { Play, Pause, Trash } from "lucide-react"
import { ActionIcon } from "@mantine/core"
import classNames from "classnames"

import styles from "./SongsList.module.scss"
import { formatDuration, getIndex } from "../../utils"


interface IProps {
    files: Audio[] | null
    selectedAudio: Audio | null
    isPlaying: boolean
    handleSelect: (file: Audio) => void
    handleDelete: (id: string, e: React.MouseEvent) => void
}

export const SongsList = ({files, selectedAudio, isPlaying, handleSelect, handleDelete}: IProps) => {
    return (
        <ul className={styles.list}>
            {files?.map((file, index) => {
                const isActive = selectedAudio?.id === file.id
                return <li key={index} className={classNames(styles.item, isActive && styles.active)} onClick={() => handleSelect(file)}>
                    <div className={styles.left}>
                        {isActive && isPlaying ? <Pause /> : <Play />}
                        <p>{getIndex(index+1)}</p>
                        <p>{file.name}</p>
                    </div>
                    <div className={styles.right}>
                        <p>{formatDuration(file.duration)}</p>
                        <ActionIcon onClick={(e) => handleDelete(file.id, e)} variant='transparent'>
                            <Trash />
                        </ActionIcon>
                    </div>
                </li>
            })}
        </ul>
    )
}