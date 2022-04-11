import React from "react";
import { Container, Button, Table } from "react-bootstrap";
import { css, StyleSheet } from "aphrodite";
import AddSimulationBtn from "../../components/admin/buttons/AddSimulationBtn";
import { logout } from "../../common/utils/authHandler";
import AdminTable from "../../components/admin/AdminTable";

export default function Admin() {
  const styles = StyleSheet.create({
    header: {
      position: "relative",
    },
    addBtn: {
      position: "absolute",
      bottom: "15%",
      right: 0,
    },
  });

  React.useEffect(() => {
    document.title = "Halaman Admin";
  }, []);

  function logoutBtnHandler(e: React.MouseEvent) {
    e.preventDefault();
    if (window.confirm("Yakin ingin keluar?")) {
      logout();
    }
  }

  return (
    <Container>
      <section className={"mt-5 " + css(styles.header)}>
        <span className="fs-1">Daftar Simulasi</span>
        <AddSimulationBtn className={css(styles.addBtn)} />
      </section>

      <Table responsive hover className="mt-3">
        <thead>
          <tr>
            <th>Detail Simulasi</th>
            <th>Jenis Simulasi</th>
          </tr>
        </thead>
        <tbody>
          <AdminTable />
        </tbody>
      </Table>

      <section className="d-flex flex-row-reverse">
        <Button variant="danger" onClick={logoutBtnHandler}>
          Log Out
        </Button>
      </section>
    </Container>
  );
}
