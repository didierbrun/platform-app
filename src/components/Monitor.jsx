import { client } from '../lib/appwrite'
import { useEffect, useState } from 'react'
import css from './Monitor.module.css'
import MBar from './MBar'

const Monitor = () => {

    
    const [gpus, setGpus] = useState([])

    useEffect(() => {
        const unsubscribe = client.subscribe(
            `databases.6846bd3a001545fafe8a.collections.6846bd550035293c8792.documents.6846bffd0012f4cbb992`,
            (response) => {

      
                // Gérer les différents types d'événements
                if (response.events.includes('databases.*.collections.*.documents.*.update')) {
      
                    setGpus(response.payload.gpus.map(d => JSON.parse(d)))
                } 
            }
        );

        return () => {
            unsubscribe();
        };
    }, [])

    return (
        <div className={css.container}>
            {
                gpus.map((g, index) => {
                    return (
                        <div key={index} className={css.row}>
                            <span className={css.gpulabel}>GPU {index}</span> :
                            <MBar percent={g.usage} label='Usage'/>
                            <MBar percent={g.memory} label='Memory'/>
                            Temp : {g.temperature}º
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Monitor