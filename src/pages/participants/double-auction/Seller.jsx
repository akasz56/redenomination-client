import { Button, Container, Form, Image, Alert } from "react-bootstrap";
import socket from "../../../adapters/SocketIO";
import { imgURL } from "../../../adapters/serverURL";
import Label from "../../../components/Label";
import Timer from "../../../components/Timer";
import {
  adjustPrice,
  capitalize,
  displayPrice,
  numberInputFormat,
} from "../../../Utils";
import { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";

export default function SellerAuctionScreen({ data, timer }) {
  const [inputPrice, setInputPrice] = useState(0);
  const [showSuccess] = useState(false);

  useEffect(() => {
    if (data.socketData === false) {
      socket.emit("da:requestList", { phaseId: data.currentPhase.id });
    }
  }, [data]);

  function submitHandler(e) {
    e.preventDefault();

    if (
      inputPrice >=
      adjustPrice(data.detail.unitCost, data.currentPhase.phaseType)
    ) {
      socket.emit("da:postSeller", {
        sellerBargain: Number(inputPrice),
        phaseId: data.currentPhase.id,
      });
      NotificationManager.success("Harga berhasil terinput", "Success");
    } else {
      alert("harga kurang dari unit cost anda!");
    }
  }

  return (
    <Container className="text-center d-flex flex-column">
      <Timer minutes={timer} />

      <Image
        src={data.goodsPic ? imgURL + data.goodsPic : ""}
        fluid
        alt={data.goodsType}
        className="mt-5 mx-auto"
        style={{ height: "360px" }}
      />

      <section className="row my-5 py-5 border rounded-pill">
        <div className="col-md-4">
          <p>Bid (Penawaran pembeli)</p>
          <h4 className="text-primary fw-bolder">
            {data.socketData.bid
              ? displayPrice(data.socketData.bid, data.currentPhase.phaseType)
              : 0}
          </h4>
        </div>
        <div className="col-md-4">
          <p>
            <span className="fw-bolder">Unit Cost</span> anda
          </p>
          <h4 className="text-primary fw-bolder">
            {displayPrice(data.detail.unitCost, data.currentPhase.phaseType)}
          </h4>
        </div>
        <div className="col-md-4">
          <p>Offer (Penawaran penjual)</p>
          <h4 className="text-primary fw-bolder">
            {data.socketData.offer
              ? displayPrice(data.socketData.offer, data.currentPhase.phaseType)
              : 0}
          </h4>
        </div>
      </section>

      {data.matched ? (
        <p>menunggu partisipan lain...</p>
      ) : (
        <Form onSubmit={submitHandler} className="mb-5">
          <Form.Group controlId="inputHarga">
            {showSuccess ? (
              <Alert variant={"success"}>Harga berhasil terinput</Alert>
            ) : (
              <></>
            )}
            <Form.Label className="mb-3">
              Masukkan <span className="fw-bolder">harga kesepakatan</span> yang
              ingin anda ajukan
            </Form.Label>
            <Form.Control
              className="text-center"
              defaultValue={isNaN(inputPrice) ? 0 : inputPrice}
              required
              onChange={(e) => {
                const value = numberInputFormat(e, e.target.value);
                setInputPrice(value);
              }}
              min={data.detail.unitCost}
              placeholder={
                data.currentPhase.phaseType !== "postRedenomPrice"
                  ? data.detail.unitCost
                  : data.detail.unitCost / 1000
              }
            />
          </Form.Group>
          <Button type="submit" className="mt-3 py-3 px-5 fs-4">
            Tetapkan
          </Button>
        </Form>
      )}

      <Label
        className="mt-5 mx-auto"
        type={capitalize(data.simulationType)}
        phase={data.currentPhase.phaseName}
        goods={data.goodsType + " (" + capitalize(data.goodsName) + ")"}
        inflation={data.inflationType}
      />
    </Container>
  );
}
