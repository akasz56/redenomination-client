import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function AddSimulationBtn(props: any) {
  const navigate = useNavigate();

  function addBtnHandler(e: React.MouseEvent) {
    e.preventDefault();
    navigate("/simulations/create");
  }

  return (
    <Button variant="primary" {...props} onClick={addBtnHandler}>
      Tambah Simulasi
    </Button>
  );
}
