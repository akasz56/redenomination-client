import { useMemo } from "react"
import { Form } from "react-bootstrap"

export default function UnitProfit(props) {
    const buyers = useMemo(() => props.buyers, [props.buyers])
    const sellers = useMemo(() => props.sellers, [props.sellers])
    const budget = useMemo(() => props.budget, [props.budget])

    const totalProfit = useMemo(() => {
        return (buyers.reduce((prev, buyer) => prev + buyer.profit, 0) +
            sellers.reduce((prev, seller) => prev + seller.profit, 0))
    }, [buyers, sellers])

    return (
        <section className='row'>
            <h1 className="text-center" style={{ marginTop: "7rem" }}>Reward masing-masing peserta Simulasi</h1>
            <hr />
            {buyers.map((buyer, i) => (
                <div key={i} className='col-md-6 d-flex justify-content-center mb-3'>
                    <Form.Control disabled
                        style={{ width: "8em" }}
                        defaultValue={buyer.username}
                    />
                    <Form.Control disabled
                        style={{ width: "12em" }}
                        defaultValue={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(((buyer.profit / totalProfit) * budget) + 5000)}
                    />
                </div>
            ))}
            {sellers.map((seller, i) => (
                <div key={i} className='col-md-6 d-flex justify-content-center mb-3'>
                    <Form.Control disabled
                        style={{ width: "8em" }}
                        defaultValue={seller.username}
                    />
                    <Form.Control disabled
                        style={{ width: "12em" }}
                        defaultValue={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(((seller.profit / totalProfit) * budget) + 5000)}
                    />
                </div>
            ))}
        </section>
    )
}
