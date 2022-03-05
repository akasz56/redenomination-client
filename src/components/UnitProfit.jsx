import { useMemo } from "react"
import { filterProfit, sumByUsername } from "../Utils";
import { Form } from "react-bootstrap";
import { CSVLink } from "react-csv";

export default function UnitProfit({ profits, budget, isSession = false }) {
    const labels = ["username", "profit"];

    function SessionElement() {
        const [sellers, buyers] = filterProfit(profits)
        const totalProfit = sumByUsername(profits).reduce((sum, item) => sum + item.profit, 0);

        return (
            <>
                <CSVLink
                    className="text-center"
                    filename={"Profit"}
                    data={[
                        labels,
                        ...sellers.map(item => [item.username, item.profit]),
                        ...buyers.map(item => [item.username, item.profit]),
                    ]}
                >Download CSV</CSVLink>

                <div className='col-md-6'>
                    <p className="fw-bold text-center">Penjual</p>
                    {sellers.map((item, i) => (
                        <div key={i} className="d-flex justify-content-center mb-3">
                            <Form.Control disabled
                                style={{ width: "8em" }}
                                defaultValue={item.username}
                            />
                            <Form.Control disabled
                                style={{ width: "12em" }}
                                defaultValue={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format((item.profit / totalProfit) * budget)}
                            />
                        </div>
                    ))}
                </div>

                <div className='col-md-6'>
                    <p className="fw-bold text-center">Pembeli</p>
                    {buyers.map((item, i) => (
                        <div key={i} className="d-flex justify-content-center mb-3">
                            <Form.Control disabled
                                style={{ width: "8em" }}
                                defaultValue={item.username}
                            />
                            <Form.Control disabled
                                style={{ width: "12em" }}
                                defaultValue={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format((item.profit / totalProfit) * budget)}
                            />
                        </div>
                    ))}
                </div>
            </>
        )
    }

    function SimulationElement() {
        const usernames = sumByUsername(profits)
        const totalProfit = useMemo(() => usernames.reduce((sum, item) => sum + item.profit, 0), [usernames])
        const usernames2 = useMemo(() => usernames, [usernames]);
        const usernames1 = useMemo(() => usernames2.splice(0, parseInt(usernames.length / 2)), [usernames, usernames2])

        return (
            <>
                <CSVLink
                    className="text-center"
                    filename={"Profit"}
                    data={[
                        labels,
                        ...usernames1.map(item => [item.username, item.profit]),
                        ...usernames2.map(item => [item.username, item.profit]),
                    ]}
                >Download CSV</CSVLink>

                <div className='col-md-6'>
                    {usernames1.map((item, i) => (
                        <div key={i} className="d-flex justify-content-center mb-3">
                            <Form.Control disabled
                                style={{ width: "8em" }}
                                defaultValue={item.username}
                            />
                            <Form.Control disabled
                                style={{ width: "12em" }}
                                defaultValue={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format((item.profit / totalProfit) * budget)}
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
                                defaultValue={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format((item.profit / totalProfit) * budget)}
                            />
                        </div>
                    ))}
                </div>
            </>
        )
    }

    return (
        <section className='row'>
            <h1 className="text-center" style={{ marginTop: "7rem" }}>Reward peserta Simulasi</h1>
            <hr />

            {isSession ?
                <SessionElement />
                :
                <SimulationElement />
            }
        </section>
    )
}
