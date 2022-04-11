import dayjs from "dayjs";
import "dayjs/locale/id";
import { css, StyleSheet } from "aphrodite";
import { Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { capitalize } from "../../common/utils/others";
import React from "react";
import AddSessionBtn from "./buttons/AddSessionBtn";

export default function SimulationTable(props: any) {
  const { sessions } = props;
  const navigate = useNavigate();

  const styles = StyleSheet.create({
    sessionList: {
      verticalAlign: "middle",
      cursor: "pointer",
    },
    sessionNumber: {
      padding: "0.5em 0",
      fontSize: "1.5em",
      textAlign: "center",
    },
  });

  function rowHandler(e: React.FormEvent, id: string) {
    e.preventDefault();
    navigate("/sessions/" + id);
  }

  return (
    <>
      <Table responsive hover className="mt-3">
        <thead>
          <tr>
            <th data-width="50">No</th>
            <th data-width="60%">Nama Ulangan</th>
            <th>Tanggal Dibuat</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((item: any, i: number) => (
            <tr
              key={i}
              className={css(styles.sessionList)}
              onClick={(e) => rowHandler(e, item.id)}
            >
              <td className={css(styles.sessionNumber)}>{i + 1}</td>
              <td className="fw-bold">{capitalize(item.sessionName)}</td>
              <td>
                {dayjs(item.timeCreated)
                  .locale("id")
                  .format("dddd, D MMM YYYY")}
              </td>
              <td>
                {item.isFinished ? (
                  <span className="fw-bold text-success">Sudah dijalankan</span>
                ) : item.isRunning ? (
                  <span>Sedang berjalan</span>
                ) : (
                  <span className="fw-bold text-primary">Belum dijalankan</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <AddSessionBtn />
    </>
  );
}
