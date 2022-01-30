import { useEffect, useState } from "react"

export default function Timer({ minutes }) {
    const [timer, setTimer] = useState(minutes * 60);

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer) {
                setTimer(timer - 1)
            }
        }, 1000);
        return () => clearInterval(interval);
    })

    return (
        <div className="d-flex justify-content-center pt-4">
            <section className="p-3 rounded shadow text-center">
                <span>Timer</span>
                <h1>
                    {Math.floor(timer / 60)}
                    :
                    {Math.floor(timer % 60)}
                </h1>
            </section>
        </div>
    )
}
