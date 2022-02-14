export default function Timer({ minutes }) {
    return (
        <div className="d-flex justify-content-center pt-4">
            <section className="p-3 rounded shadow text-center">
                <span>Timer</span>
                <h1>
                    {(parseInt(minutes) / 60)}
                    :
                    {(parseInt(minutes) % 60)}
                </h1>
            </section>
        </div>
    )
}
