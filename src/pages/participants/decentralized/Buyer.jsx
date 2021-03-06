import { useEffect, useState } from "react";
import { Button, Container, Image } from "react-bootstrap";
import socket from "../../../adapters/SocketIO";
import { imgURL } from "../../../adapters/serverURL";
import Card from "../../../components/Card";
import Label from "../../../components/Label";
import Timer from "../../../components/Timer";
import { capitalize, displayPrice, isEmptyObject } from "../../../Utils";

export function BuyerIdleDS({ data, timer }) {
  return (
    <Container className="text-center d-flex flex-column">
      <Timer minutes={timer} />
      <p className="mt-5">
        Anda mendapat <span className="fw-bolder">Unit Value</span> sebesar
      </p>
      <h1 className="mb-4 mb-xl-5 text-primary fw-bolder">
        {displayPrice(data.detail.unitValue, data.currentPhase.phaseType)}
      </h1>

      <Image
        src={data.goodsPic ? imgURL + data.goodsPic : ""}
        fluid
        alt={data.goodsType}
        className="mx-auto"
        style={{ height: "360px" }}
      />
      <p className="mt-5">menunggu penjual memasang harga......</p>

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

export function ShopHandler({ data, timer }) {
  const [isInside, setIsInside] = useState(null);
  const [hasBought, setHasBought] = useState(false);

  useEffect(() => {
    document.title = "Decentralized";
  }, [isInside]);

  useEffect(() => {
    if (isEmptyObject(data.seller)) {
      socket.emit("ds:requestList", { phaseId: data.currentPhase.id });
    } else {
      const exists = data.seller.findIndex(
        (item) => item.buyerId === data.detail.id
      );
      if (exists !== -1) {
        setHasBought(true);
        setIsInside(null);
      }
    }
  }, [data]);

  useEffect(() => {
    if (!isEmptyObject(data.seller) && isInside) {
      const thisShop = data.seller.find(
        (item) => item.decentralizedId === isInside
      );
      if (thisShop.status === true) {
        setIsInside(null);
      }
    }
  }, [data.seller, isInside]);

  function clickHandler(e, item) {
    e.preventDefault();
    setIsInside(item.decentralizedId);
  }

  if (isInside) {
    return (
      <ShopView
        timer={timer}
        setIsInside={setIsInside}
        setHasBought={setHasBought}
        data={{
          ...data,
          hasBought: hasBought,
          shop: data.seller.find((item) => item.decentralizedId === isInside),
        }}
      />
    );
  } else {
    return (
      <Container className="text-center d-flex flex-column">
        <Timer minutes={timer} />
        <h3 className="mt-5">
          Silahkan <span className="fw-bold">Pilih Penjual</span> untuk melihat
          Harga
        </h3>
        <section className="mt-5 d-flex justify-content-between flex-wrap">
          {isEmptyObject(data.seller) ? (
            <></>
          ) : (
            data.seller.map((item, i) => (
              <Card
                key={i}
                variant={
                  item.status ? "done" : hasBought ? "wait" : "decentralized"
                }
                className="mb-3"
                role={item.role}
                onBtnClick={(e) => {
                  clickHandler(e, item);
                }}
              />
            ))
          )}
        </section>

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
}

function ShopView({ data, timer, setIsInside, setHasBought }) {
  useEffect(() => {
    document.title = data.shop.role + " - Decentralized";
  }, [data.shop.role]);

  function clickBack() {
    setIsInside(null);
  }

  function clickBuy(e) {
    e.preventDefault();

    if (window.confirm("yakin membeli?")) {
      socket.emit("ds:buy", {
        decentralizedId: data.shop.decentralizedId,
        phaseId: data.currentPhase.id,
      });
      setHasBought(true);
    }
  }

  const block =
    data.shop.price > data.detail.unitValue ? (
      <>
        <p className="mb-3">Harga tersebut melebihi Unit Value anda</p>
        <div className="mt-3">
          <Button
            onClick={clickBack}
            variant="secondary"
            className="fs-4 py-2 px-4"
          >
            {" "}
            <i className="bx bx-arrow-back"></i> Kembali
          </Button>
        </div>
      </>
    ) : (
      <>
        <p className="mb-3">
          Unit Value anda sebesar{" "}
          <span className="fw-bold">
            {displayPrice(data.detail.unitValue, data.currentPhase.phaseType)}
          </span>
        </p>
        <div className="mt-3">
          <Button
            onClick={clickBack}
            variant="secondary"
            className="fs-4 py-2 px-4"
          >
            {" "}
            <i className="bx bx-arrow-back"></i> Kembali
          </Button>
          <Button onClick={clickBuy} className="fs-4 py-2 px-4 ms-3">
            {" "}
            <i className="bx bxs-cart-add"></i> Beli
          </Button>
        </div>
      </>
    );
  return (
    <Container className="text-center d-flex flex-column">
      <Timer minutes={timer} />
      <p className="mt-5">
        Harga yang ditawarkan oleh{" "}
        <span className="fw-bold">{data.shop.role}</span> adalah
      </p>
      <h1 className="mb-4 mb-xl-5 text-primary fw-bolder">
        {displayPrice(data.shop.price, data.currentPhase.phaseType)}
      </h1>

      {data.hasBought ? (
        <p className="mt-5">menunggu partisipan lain...</p>
      ) : (
        block
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
