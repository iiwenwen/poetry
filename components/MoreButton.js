import { useState } from "react"

export default function MoreButton () {
    const [cnt, setCnt] = useState(1)
    // const pages = []
    // for (let i = 0; i < cnt; i++) {
    //     pages.push(<Page index={i} key={i} />)
    // }
    return (<div>
        <button onClick={() => setCnt(cnt + 1)
        }> Load More</button >
    </div>
    )
}