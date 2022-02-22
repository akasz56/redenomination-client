import { Container } from "react-bootstrap";
import Label from "../../components/Label";
import { capitalize } from "../../Utils";

export default function CompleteScreenHandler({ data }) {

    return (
        <Container className='text-center d-flex flex-column'>
            <h1 className='text-center mt-5'>Simulasi Selesai</h1>

            <Label
                className="mt-5 mx-auto"
                phase={capitalize(data.simulationType) + " (" + data.detail.loginToken + ")"}
                goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
                inflation={data.inflationType}
            />
        </Container>
    )
}