import React, { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { CreateKomentar } from "../../api/apiKomentar";
import { toast } from "react-toastify";

const ModalCreateKomentar = ({ onClose, contentId }) => {
  const [data, setData] = useState({
    comment: "",
  });
  const [isPending, setIsPending] = useState(false);

  const handleCommentChange = (event) => {
    setData({ ...data, comment: event.target.value });
  };

  const submitData = (event) => {
    event.preventDefault();
    setIsPending(true);
  
    const formData = new FormData();
    formData.append("comment", data.comment);
    formData.append("id_content", contentId);  
    formData.append("date_added", new Date().toISOString());
  
    CreateKomentar(formData)
      .then((response) => {
        setIsPending(false);
        toast.success(response.message);
        onClose();
      })
      .catch((err) => {
        setIsPending(false);
        toast.dark(JSON.stringify(err.message));
      });
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitData}>
          <Form.Group className="mb-3">
            <Form.Label>Tuliskan komentar baru:</Form.Label>
            <Form.Control
              as="textarea"
              value={data.comment} 
              onChange={handleCommentChange}
              rows={3}
              placeholder="Add New Comment"
              required
            />
          </Form.Group>
          <div className="text-end">
            <Button
              type="submit"
              variant="primary"
              className="ms-2"
              disabled={isPending || data.comment.trim() === ""} 
            >
              {isPending ? <Spinner animation="border" size="sm" /> : "Kirim"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCreateKomentar;
