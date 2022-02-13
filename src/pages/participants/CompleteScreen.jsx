import { Container } from "react-bootstrap";
import Label from "../../components/Label";
import LoadingComponent from "../../components/Loading";
import { capitalize } from "../../Utils";

export default function CompleteScreen({ data }) {
    const kontak = "6289608703393"

    function roundNumber(number) {
        const rounding = 100
        return Math.floor(number / rounding) * rounding;
    }

    function generateLink() {
        return "https://wa.me/" + kontak + "?text=Saya menerima reward sebesar " + data.rewards + " dalam simulasi " + data.simulationType + " (" + data.loginToken + ")"
    }

    return (
        <Container className='text-center d-flex flex-column'>
            <h1 className='text-center mt-5'>Simulasi Selesai</h1>
            {(data.rewards >= 0) ?
                <p className='mt-5'>
                    Selamat, anda mendapatkan hadiah sebesar
                    <span className='text-primary fw-bolder fs-1 d-block'>Rp. {roundNumber(data.rewards)}</span>
                    Silahkan klik tombol dibawah untuk menghubungi peneliti
                </p>
                :
                <LoadingComponent className="mx-auto my-5" />
            }

            <div className="mx-auto mt-4">
                <a href={generateLink()} className='btn btn-primary px-4 py-3 fs-3' target="_blank" rel="noreferrer">Kontak</a>
            </div>

            <Label
                className="mt-5 mx-auto"
                phase={data.simulationType + " (" + data.loginToken + ")"}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container>
    )
}