import { useMemo } from "react"
import { sumByUsername } from "../Utils";
import { Form } from "react-bootstrap";

export default function UnitProfit({ profits, budget }) {
    const usernames = useMemo(() => sumByUsername(profits), [profits])
    const totalProfit = useMemo(() => usernames.reduce((sum, item) => sum + item.profit, 0), [usernames])
    const usernames2 = useMemo(() => usernames, [usernames]);
    const usernames1 = useMemo(() => usernames2.splice(0, parseInt(usernames.length / 2)), [usernames])

    return (
        <section className='row'>
            <h1 className="text-center" style={{ marginTop: "7rem" }}>Reward masing-masing peserta Simulasi</h1>
            <hr />

            <div className='col-md-6'>
                {usernames1.map((item, i) => (
                    <div key={i} className="d-flex justify-content-center mb-3">
                        <Form.Control disabled
                            style={{ width: "8em" }}
                            defaultValue={item.username}
                        />
                        <Form.Control disabled
                            style={{ width: "12em" }}
                            defaultValue={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(((item.profit / totalProfit) * budget) + 5000)}
                        />
                    </div>
                ))}
            </div>

            <div className='col-md-6'>
                {usernames2.map((item, i) => (
                    <div key={i} className="d-flex justify-content-center mb-3">
                        <Form.Control disabled
                            style={{ width: "8em" }}
                            defaultValue={item.username}
                        />
                        <Form.Control disabled
                            style={{ width: "12em" }}
                            defaultValue={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(((item.profit / totalProfit) * budget) + 5000)}
                        />
                    </div>
                ))}
            </div>

        </section>
    )
}
