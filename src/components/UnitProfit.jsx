import { useMemo } from "react"
import { Form } from "react-bootstrap"

export default function UnitProfit(props) {
    const buyers = useMemo(() => props.buyers, [props.buyers])
    const sellers = useMemo(() => props.sellers, [props.sellers])

    return (
        <section className='row'>
            <h1>Reward masing-masing peserta Simulasi</h1>
            {buyers.map((buyer, i) => (
                <div key={i} className='col-md-6 d-flex justify-content-center'>
                    <Form.Control disabled
                        style={{ width: "8em" }}
                        defaultValue={buyer.username}
                    />
                    <Form.Control disabled
                        style={{ width: "12em" }}
                        defaultValue={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(buyer.profit)}
                    />
                </div>
            ))}
            {sellers.map((seller, i) => (
                <div key={i} className='col-md-6 d-flex justify-content-center'>
                    <Form.Control disabled
                        style={{ width: "8em" }}
                        defaultValue={seller.username}
                    />
                    <Form.Control disabled
                        style={{ width: "12em" }}
                        defaultValue={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(seller.profit)}
                    />
                </div>
            ))}
        </section>
    )
}
