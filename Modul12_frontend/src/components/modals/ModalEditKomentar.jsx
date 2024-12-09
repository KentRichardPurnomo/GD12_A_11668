import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";

import InputForm from "../forms/InputFloatingForm";
import { UpdateKomentar } from "../../api/apiKomentar";

const ModalEditKomentar = ({ komentar, onClose }) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(komentar);
  const [isPending, setIsPending] = useState(false);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const handleShow = () => setShow(true);

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const submitData = (event) => {
    event.preventDefault();
    setIsPending(true);

    UpdateKomentar(data)
      .then((response) => {
        setIsPending(false);
        toast.success(response.message);
        handleClose();
      })
      .catch((err) => {
        setIsPending(false);
        toast.error(err.message);
      });
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <FaEdit className="mx-1 mb-1" />
      </Button>

      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={submitData}>
          <Modal.Body>
            <InputForm
              as="textarea"
              label="Comment Content"
              name="comment"
              placeholder="Edit komentar Anda..."
              value={data?.comment}
              onChange={handleChange}
              style={{ height: "6rem" }}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : (
                <span><i class="bi bi-floppy"></i> Update Comment</span>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ModalEditKomentar;
