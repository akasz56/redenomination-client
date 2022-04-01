import { useMemo, useRef } from "react";
import { Button } from "react-bootstrap";
import { Scatter } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import { downloadPNG, getRandomColor } from "../Utils";

import dayjs from "dayjs";

export default function ScatterSummaryDA({ bargain, trx, title, nameArr }) {
  const data = useMemo(() => {
    let session = [
      bargain[0]
        .concat(trx[0])
        .sort((a, b) => dayjs(a.timeCreated).diff(dayjs(b.timeCreated))),
      bargain[1]
        .concat(trx[1])
        .sort((a, b) => dayjs(a.timeCreated).diff(dayjs(b.timeCreated))),
      bargain[2]
        .concat(trx[2])
        .sort((a, b) => dayjs(a.timeCreated).diff(dayjs(b.timeCreated))),
    ];

    session.forEach((phase) => {
      phase.forEach((item, index) => {
        if (item.postedBy === undefined) {
          phase.splice(index - 1, 1);
          item.postedBy = "transaction";
        }
      });
    });

    return session;
  }, [bargain, trx]);
  const fileName = useMemo(() => nameArr.join("_"), [nameArr]);
  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref = [ref0, ref1, ref2];

  const headers = useMemo(
    () => [
      { label: "Turn", key: "x" },
      { label: "Price", key: "y" },
      { label: "Role", key: "z" },
    ],
    []
  );

  const csvArr = useMemo(
    () => [
      {
        data: data[0].map((item, index) => ({
          x: index + 1,
          y: parseInt(item.price),
          z: item.postedBy,
        })),
        headers: headers,
        filename: fileName + "_" + title[0] + ".csv",
      },
      {
        data: data[1].map((item, index) => ({
          x: index + 1,
          y: parseInt(item.price),
        })),
        headers: headers,
        filename: fileName + "_" + title[1] + ".csv",
      },
      {
        data: data[2].map((item, index) => ({
          x: index + 1,
          y: parseInt(item.price),
        })),
        headers: headers,
        filename: fileName + "_" + title[2] + ".csv",
      },
    ],
    [data, title, headers, fileName]
  );

  function ScatterElementDA({ index }) {
    const buyerBargain = useMemo(() => {
      return data[index]
        .filter(
          (item) => item.postedBy === "buyer" || item.postedBy === "transaction"
        )
        .map((item, index) => ({
          x: index + 1,
          y: parseInt(item.price),
        }));
    }, [index]);

    const sellerBargain = useMemo(() => {
      return data[index]
        .filter(
          (item) =>
            item.postedBy === "seller" || item.postedBy === "transaction"
        )
        .map((item, index) => ({
          x: index + 1,
          y: parseInt(item.price),
        }));
    }, [index]);

    return (
      <div className="col-md-4">
        <Scatter
          ref={ref[index]}
          data={{
            datasets: [
              {
                label: "Penjual",
                data: sellerBargain,
                pointStyle: "crossRot",
                radius: 5,
                borderWidth: 2,
                borderColor: getRandomColor(),
              },
              {
                label: "Pembeli",
                data: buyerBargain,
                pointStyle: "circle",
                radius: 5,
                backgroundColor: getRandomColor(),
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                display: true,
                text: title[index],
              },
            },
          }}
        />
        <div className="d-flex justify-content-around">
          <Button
            onClick={(e) => {
              e.preventDefault();
              downloadPNG(ref[index], csvArr[index].filename);
            }}
          >
            <i className="bx bx-download"></i> Download PNG
          </Button>
          <CSVLink className="btn btn-primary" {...csvArr[index]}>
            <i className="bx bx-download"></i> Download CSV
          </CSVLink>
        </div>
      </div>
    );
  }

  return (
    <section className="row">
      <>
        <ScatterElementDA index={0} />
        <ScatterElementDA index={1} />
        <ScatterElementDA index={2} />
      </>
    </section>
  );
}
