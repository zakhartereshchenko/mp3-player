import { useDropzone } from "react-dropzone"
import type { Audio } from "../Player/Player"
import { getDuration } from "../../utils"
import { v4 as uuid } from 'uuid'

import styles from './Dropzone.module.scss'

interface IProps {
    onAccept: (files: Audio[]) => void
}

export const Dropzone = ({onAccept}: IProps) => {

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept: {'audio/*': []},
        onDrop: async (acceptedFiles) => {
            const files = await Promise.all(acceptedFiles.map(async (file) =>({
                url: URL.createObjectURL(file),
                name: file.name,
                size: file.size,
                duration: await getDuration(file) as number,
                id: uuid()
            })))
            onAccept(files)
        }
    })

    return (
        <div {...getRootProps()} className={styles.dropzone}>
            <input {...getInputProps()} className={styles.input} />
            {
                isDragActive 
                ? <p>Drop the files here ...</p> 
                : <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    )
}