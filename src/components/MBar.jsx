import css from './MBar.module.css'

const MBar = ({ label, percent }) => {
    return (
        <div className={css.container}>
            <span className={css.label}>{label}</span>
            <div className={css.bar}>
                <div className={css.progress} style={{width: `${percent}px`}}></div>
            </div>
        </div>
    )
}

export default MBar