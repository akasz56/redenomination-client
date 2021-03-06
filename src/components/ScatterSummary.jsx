import { useMemo, useRef } from "react";
import { Button } from "react-bootstrap";
import { Scatter } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import { downloadPNG, getRandomColor } from "../Utils";

export default function ScatterSummary({ data, title, nameArr }) {
  const fileName = useMemo(() => nameArr.join("_"), [nameArr]);
  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref = [ref0, ref1, ref2];

  const headers = useMemo(
    () => [
      { label: "Turn", key: "x" },
      { label: "Price", key: "y" },
    ],
    []
  );

  const csvArr = useMemo(
    () => [
      {
        data: data[0].map((item, index) => ({
          x: index + 1,
          y: parseInt(item.price),
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

  function ScatterElement({ index }) {
    return (
      <div className="col-md-4">
        <Scatter
          ref={ref[index]}
          data={{
            datasets: [
              {
                label: "Penjual",
                data: data[index].map((item, index) => ({
                  x: index + 1,
                  y: parseInt(item.price),
                })),
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
        <ScatterElement index={0} />
        <ScatterElement index={1} />
        <ScatterElement index={2} />
      </>
    </section>
  );
}
