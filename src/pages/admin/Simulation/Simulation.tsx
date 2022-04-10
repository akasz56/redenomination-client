import dayjs from "dayjs";
import "dayjs/locale/id";
import React from "react";
// import { Button, Table } from "react-bootstrap";
import { Container } from "react-bootstrap/lib/Tab";
import { Link, useParams } from "react-router-dom";
import { readSimulation } from "../../../common/adapters/simulation.adapter";
import { capitalize } from "../../../common/utils/others";
import LoadingScreen from "../../../components/LoadingScreen";
import Error404 from "../../errors/Error404";

export default function Simulation() {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [dataGet, setDataGet] = React.useState<any>({});
  const { simulationID } = useParams();

  React.useEffect(() => {
    document.title = "Tidak ada Data";

    async function fetchData(simulationID: string) {
      await readSimulation(simulationID)
        .then((res) => {
          setDataGet(res);
          document.title = "Simulasi " + simulationID;
        })
        .finally(() => {
          setLoading(false);
        });
    }

    if (simulationID) {
      fetchData(simulationID);
    }
  }, [simulationID]);

  if (loading) return <LoadingScreen className="child" />;
  else {
    if (dataGet) {
      return (
        <Container>
          <SimulationHeader
            type={dataGet.simulationType}
            token={dataGet.token}
            time={dataGet.timeCreated}
          />
          {/*
          <SimulationTable />
          <SimulationSummary />
          <UnitCostValueList />
          <UnitCostValueList2 />
          <SimulationDetail />
          <SimulationDelete />
          */}
        </Container>
      );
    } else {
      return <Error404 />;
    }
  }
}

function SimulationHeader(props: any) {
  const simulationType = capitalize(props.simulationType) ?? "simulationType";
  const token = props.token ?? "token";
  const timeCreated = props.timeCreated ?? "timeCreated";

  return (
    <section className="header mt-5 row">
      <div className="col-6">
        <h1>{simulationType}</h1>
        <div>
          Token Partisipan:{" "}
          <span className="fw-bold text-primary">{token}</span>
        </div>
      </div>
      <div className="col-6 text-end">
        <div>{dayjs(timeCreated).locale("id").format("dddd, D MMM YYYY")}</div>
        <Link to="./edit" className="btn btn-outline-dark py-1">
          Edit
        </Link>
      </div>
    </section>
  );
}

// function SimulationTable() {
// function rowHandler(e, id) {
//   e.preventDefault();
//   navigate("/sessions/" + id);
// }
//   return (
//     <>
//       <Table responsive hover className="mt-3">
//         <thead>
//           <tr>
//             <th width="50">No</th>
//             <th width="60%">Nama Ulangan</th>
//             <th>Tanggal Dibuat</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {dataGet.sessions.map((item, i) => (
//             <tr
//               key={i}
//               className="simulations"
//               onClick={(e) => rowHandler(e, item.id)}
//             >
//               <td className="number">{i + 1}</td>
//               <td className="fw-bold">{capitalize(item.sessionType)}</td>
//               <td>
//                 {dayjs(item.timeCreated)
//                   .locale("id")
//                   .format("dddd, D MMM YYYY")}
//               </td>
//               <td>
//                 {item.timeCreated !== item.timeLastRun ? (
//                   <span className="fw-bold text-success">Sudah dijalankan</span>
//                 ) : item.isRunning ? (
//                   <span>Sedang berjalan</span>
//                 ) : (
//                   <span className="fw-bold text-primary">Belum dijalankan</span>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//       <SessionAdd />
//     </>
//   );
// }

// function SimulationSummary() {
//   const [dataSummary, setDataSummary] = useState(false);

//   React.useEffect(() => {
//     async function fetchSummary() {
//       const res1 = await readSimulationSummary(urlParams.id);
//       if (res1.status === 200) {
//         if (res1.data.sessionSummary.length >= 1) {
//           setDataSummary({
//             price: {
//               labels: [
//                 "Pre-Redenominasi",
//                 "Transisi Redenominasi",
//                 "Pasca Redenominasi",
//               ],
//               datasets: res1.data.sessionSummary.map((session, idx) => {
//                 const randomColor = getRandomColor();
//                 return {
//                   label: "Ulangan " + (idx + 1),
//                   data: session.phaseSummary.map((phase) => phase.avgTrxPrice),
//                   borderColor: randomColor,
//                   backgroundColor: randomColor,
//                 };
//               }),
//             },
//             trx: {
//               labels: [
//                 "Pre-Redenominasi",
//                 "Transisi Redenominasi",
//                 "Pasca Redenominasi",
//               ],
//               datasets: res1.data.sessionSummary.map((session, idx) => {
//                 const randomColor = getRandomColor();
//                 return {
//                   label: "Ulangan " + (idx + 1),
//                   data: session.phaseSummary.map(
//                     (phase) => phase.avgTrxOccurrence
//                   ),
//                   borderColor: randomColor,
//                   backgroundColor: randomColor,
//                 };
//               }),
//             },
//           });
//         }
//       } else {
//         printLog(res1);
//         alert("fetch Summary Fail");
//       }
//     }
//   });

//   return (
//     <>
//       {dataSummary ? (
//         <>
//           <UnitProfit
//             profits={sessionProfitsToArray(dataGet.sessions)}
//             budget={dataGet.simulationBudget * dataGet.sessions.length}
//           />

//           <section style={{ marginTop: "5rem" }} className="row">
//             <h1 className="text-center">Ringkasan Simulasi</h1>
//             <hr />
//             <div className="col-md-6">
//               <Line
//                 data={dataSummary.trx}
//                 width={"100px"}
//                 height={"50px"}
//                 ref={trxOccurrence}
//                 options={{
//                   plugins: {
//                     title: {
//                       display: true,
//                       text: "Jumlah Transaksi",
//                     },
//                   },
//                 }}
//               />
//               <div className="d-flex justify-content-around">
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     downloadPNG(
//                       trxOccurrence,
//                       "Jumlah Transaksi " + dataGet.token
//                     );
//                   }}
//                 >
//                   <i className="bx bx-download"></i> Download PNG
//                 </Button>
//                 <CSVLink
//                   className="btn btn-primary"
//                   filename={"Jumlah Transaksi " + dataGet.token}
//                   data={[
//                     ["Ulangan"].concat(dataSummary.trx.labels),
//                     ...dataSummary.trx.datasets.map((dataset) => [
//                       dataset.label,
//                       ...dataset.data,
//                     ]),
//                   ]}
//                 >
//                   <i className="bx bx-download"></i> Download CSV
//                 </CSVLink>
//               </div>
//             </div>
//             <div className="col-md-6">
//               <Line
//                 data={dataSummary.price}
//                 width={"100px"}
//                 height={"50px"}
//                 ref={trxPrice}
//                 options={{
//                   plugins: {
//                     title: {
//                       display: true,
//                       text: "Rata-rata Harga kesepakatan",
//                     },
//                   },
//                 }}
//               />
//               <div className="d-flex justify-content-around">
//                 <Button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     downloadPNG(
//                       trxPrice,
//                       "Rata-rata Harga Kesepakatan Transaksi " + dataGet.token
//                     );
//                   }}
//                 >
//                   <i className="bx bx-download"></i> Download PNG
//                 </Button>
//                 <CSVLink
//                   className="btn btn-primary"
//                   filename={
//                     "Rata-rata Harga Kesepakatan Transaksi " + dataGet.token
//                   }
//                   data={[
//                     ["Ulangan"].concat(dataSummary.price.labels),
//                     ...dataSummary.price.datasets.map((dataset) => [
//                       dataset.label,
//                       ...dataset.data,
//                     ]),
//                   ]}
//                 >
//                   <i className="bx bx-download"></i> Download CSV
//                 </CSVLink>
//               </div>
//             </div>
//           </section>
//         </>
//       ) : (
//         <></>
//       )}
//     </>
//   );
// }

// function UnitCostValueList() {
//   return (
//     <section style={{ marginTop: "5rem" }} className="row">
//       <h1 className="text-center">Peserta</h1>
//       <hr />
//       <div className="col-md-6">
//         <p className="fw-bold text-center">Daftar Penjual</p>
//         {dataGet.sellers.map((item, i) => (
//           <UnitPlayer key={i + 1} id={i + 1} role="penjual" item={item} />
//         ))}
//       </div>
//       <div className="col-md-6">
//         <p className="fw-bold text-center">Daftar Pembeli</p>
//         {dataGet.buyers.map((item, i) => (
//           <UnitPlayer key={i + 1} id={i + 1} role="pembeli" item={item} />
//         ))}
//       </div>
//     </section>
//   );
// }

// function UnitCostValueList2() {
//   return (
//     <section style={{ marginTop: "5rem" }} className="row">
//       <h1 className="text-center">Unit Cost dan Unit Value</h1>
//       <hr />
//       <div className="col-md-6">
//         <p className="fw-bold text-center">Unit Cost</p>
//         {dataGet.sellers.map((_, i) => (
//           <UnitInput
//             disabled
//             key={i + 1}
//             id={i + 1}
//             role="penjual"
//             defaultValue={displayPrice(dataGet.sellers[i].unitCost)}
//           />
//         ))}
//       </div>
//       <div className="col-md-6">
//         <p className="fw-bold text-center">Unit Value</p>
//         {dataGet.buyers.map((_, i) => (
//           <UnitInput
//             disabled
//             key={i + 1}
//             id={i + 1}
//             role="pembeli"
//             defaultValue={displayPrice(dataGet.buyers[i].unitValue)}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

// function SimulationDetail() {
//   return (
//     <section style={{ marginTop: "5rem" }} className="info">
//       <h1 className="text-center">Detail Simulasi</h1>
//       <hr />
//       <div className="row text-center">
//         <div className="col-md-6">
//           <p>
//             Jenis Pertumbuhan Ekonomi :{" "}
//             <span className="fw-bold">{dataGet.growthType}</span>
//           </p>
//           <p>
//             Jenis Barang :{" "}
//             <span className="fw-bold">
//               {dataGet.goodsType} ({dataGet.goodsName})
//             </span>
//           </p>
//         </div>
//         <div className="col-md-6">
//           <p>
//             Anggaran per ulangan :{" "}
//             <span className="fw-bold">
//               {new Intl.NumberFormat("id-ID", {
//                 style: "currency",
//                 currency: "IDR",
//               }).format(dataGet.simulationBudget)}
//             </span>
//           </p>
//           <p>
//             Jenis Inflasi :{" "}
//             <span className="fw-bold">{dataGet.inflationType}</span>
//           </p>
//         </div>
//       </div>
//       {dataGet.goodsPic !== "" ? (
//         <figure className="d-flex flex-column">
//           <div className="mx-auto">
//             <Image
//               src={dataGet.goodsPic ? imgURL + dataGet.goodsPic : ""}
//               fluid
//               alt={dataGet.goodsType}
//               style={{ height: "360px" }}
//             />
//             <p>Illustrasi barang</p>
//           </div>
//         </figure>
//       ) : (
//         <></>
//       )}
//     </section>
//   );
// }

// function SimulationDelete() {
// const [showModal, setshowModal] = useState(false);

// function toggleModal(e) {
//   setshowModal((prev) => !prev);
// }

// async function submitDelete(e) {
//   e.preventDefault();
//   setshowModal((prev) => !prev);

//   if (
//     e.target.elements.confirm.value === capitalize(dataGet.simulationType)
//   ) {
//     setLoading(true);
//     const res = await deleteSimulation(dataGet.id);
//     if (res.status === 200) {
//       window.location.href = "/admin";
//     } else if (res.status === 401) {
//       printLog(res);
//       window.alert("Tidak diizinkan mengakses");
//       setLoading(false);
//     } else {
//       printLog(res);
//       alert("Terjadi Kesalahan, mohon coba lagi");
//       setLoading(false);
//     }
//   } else {
//     alert("Simulasi gagal dihapus");
//   }
// }
//   return (
//     <>
//       <section style={{ marginTop: "5rem" }} className="mb-5">
//         <h1 className="text-center">Hapus Simulasi</h1>
//         <hr />
//         <Button
//           variant="danger"
//           className="mt-3"
//           onClick={toggleModal}
//         >
//           Hapus Simulasi
//         </Button>
//       </section>
//       <Modal show={showModal} onHide={toggleModal} centered>
//         <form onSubmit={submitDelete}>
//           <Modal.Header closeButton>
//             <Modal.Title>Konfirmasi Hapus Simulasi</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form.Group controlId="confirm">
//               <p>
//                 Aksi ini <strong>tidak dapat dibatalkan</strong>. Ketik ulang
//                 Tipe Simulasi untuk mengkonfirmasi anda benar-benar ingin
//                 menghapus.
//               </p>
//               <Form.Control
//                 required
//                 placeholder={capitalize(dataGet.simulationType)}
//                 name="confirm"
//               />
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={toggleModal}>
//               Batalkan
//             </Button>
//             <Button variant="danger" type="submit">
//               Konfirmasi Hapus
//             </Button>
//           </Modal.Footer>
//         </form>
//       </Modal>
//     </>
//   );
// }

// function SessionAdd() {
// const [showModal, setshowModal] = useState(false);
//   const [dataPost, setDataPost] = React.useState<object>({
//     simulationID: res.data.id,
//     sessionType: "Ulangan Kesekian",
//     timer: 1,
//   });
//   const { simulationID } = useParams();

// function toggleModal(e) {
//   setshowModal((prev) => !prev);
// }

// async function submitCreateSession(e) {
//   e.preventDefault();
//   toggleModal();

//   setLoading(true);
//   const res = await createSession(dataPost);
//   if (res.status === 201) {
//     window.location.href = "/sessions/" + res.data.id;
//   } else if (res.status === 401) {
//     printLog(res);
//     window.alert("Tidak diizinkan mengakses");
//     setLoading(false);
//   } else {
//     printLog(res);
//     alert("Terjadi Kesalahan, mohon coba lagi");
//     setLoading(false);
//   }
// }
//   return (
//     <>
//       <Button className="w-100 py-lg-2" onClick={toggleModal}>
//         + Tambah ulangan
//       </Button>
//       <Modal show={showModal} onHide={toggleModal}>
//         <form onSubmit={submitCreateSession}>
//           <Modal.Header closeButton>
//             <Modal.Title>Tambah Ulangan Simulasi</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form.Group controlId="sessionType">
//               <Form.Label className="required">Nama Sesi</Form.Label>
//               <Form.Control
//                 type="text"
//                 defaultValue={dataPost.sessionType}
//                 required
//                 onChange={(e) => {
//                   setDataPost({ ...dataPost, sessionType: e.target.value });
//                 }}
//               />
//             </Form.Group>
//             <Form.Group controlId="timer" className="mt-3">
//               <Form.Label className="required">Timer</Form.Label>
//               <br />
//               <Form.Control
//                 type="number"
//                 style={{ width: "3.8em", display: "inline" }}
//                 required
//                 min={0}
//                 step={1}
//                 defaultValue={dataPost.timer}
//                 onChange={(e) => {
//                   setDataPost({ ...dataPost, timer: e.target.value });
//                 }}
//               />
//               &nbsp;Menit
//             </Form.Group>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={showCreateSessionForm}>
//               Close
//             </Button>
//             <Button variant="primary" type="submit">
//               Save Changes
//             </Button>
//           </Modal.Footer>
//         </form>
//       </Modal>
//     </>
//   );
// }
