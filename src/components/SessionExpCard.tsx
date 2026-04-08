import { Dialog } from "primereact/dialog";
import { ProgressBar } from "primereact/progressbar";
import React, { useState } from "react";

function SessionExpCard() {
  const [visible, setVisible] = useState(false);

  const footerTemplate = () => {
    return (
      <>
        <ProgressBar
          mode="indeterminate"
          style={{ height: "5px", transition: "width 0.5s ease-in-out" }}
        ></ProgressBar>
      </>
    );
  };

  return (
    <div className="card flex justify-content-center">
      <Dialog
        header="Session Expired"
        footer={footerTemplate}
        visible={true}
        closable={false}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <p className="m-0">Signing Out. Please Login again !</p>
      </Dialog>
    </div>
  );
}

export default SessionExpCard;
