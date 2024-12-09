import { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Spinner, Stack, Button, Modal } from "react-bootstrap";
import { GetAllContents } from "../api/apiContent";
import { getThumbnail } from "../api";
import { toast } from "react-toastify";

import ModalCreateKomentar from "../components/modals/ModalCreateKomentar";
import ModalEditKomentar from "../components/modals/ModalEditKomentar";

import { GetAllKomentarByContentId, DeleteKomentar } from "../api/apiKomentar";
import { FaTrash } from "react-icons/fa";

const DashboardPage = () => {
  const [contents, setContents] = useState([]);
  const [komentar, setKomentar] = useState([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isKomentarLoading, setIsKomentarLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchKomentar = (contentId) => {
    if (!contentId) return;
    setIsKomentarLoading(true);
    GetAllKomentarByContentId(contentId)
      .then((response) => {
        setKomentar(response);
        setIsKomentarLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsKomentarLoading(false);
      });
  };

  const deleteKomentar = (id) => {
    if (!id) return;
    setIsPending(true);
    DeleteKomentar(id)
      .then((response) => {
        setIsPending(false);
        toast.success(response.message);
        if (selectedContent?.id) fetchKomentar(selectedContent.id);
      })
      .catch((err) => {
        setIsPending(false);
        toast.error(err.message);
      });
  };

  const fetchContents = () => {
    setIsLoading(true);
    GetAllContents()
      .then((data) => {
        setContents(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast.error("Gagal memuat konten!");
        console.error(err);
      });
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
  if (user && user.name) {
    setUsername(user.name);
  }
    fetchContents();
  }, []);

  const handleShowKomentar = (contentId) => {
    const content = contents.find((content) => content.id === contentId);
    if (content) {
      setSelectedContent(content);
      fetchKomentar(contentId);
    }
  };

  const handleOpenModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    fetchKomentar(selectedContent?.id);
  };

  return (
    <Container className="mt-4">
      <Stack direction="horizontal" gap={3} className="mb-3">
        <h1 className="h4 fw-bold mb-0 text-nowrap">Rekomendasi Untukmu</h1>
        <hr className="border-top border-light opacity-50 w-100" />
      </Stack>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <h6 className="mt-2">Loading...</h6>
        </div>
      ) : contents?.length > 0 ? (
        <Row>
          {contents.map((content) => (
            <Col md={6} lg={4} className="mb-3" key={content.id}>
              <div className="card text-white" style={{ aspectRatio: "16 / 9" }}>
                <img
                  src={getThumbnail(content.thumbnail)}
                  className="card-img w-100 h-100 object-fit-cover bg-light"
                  alt="Thumbnail"
                />
                <div className="card-body">
                  <h5 className="card-title text-truncate">{content.title}</h5>
                  <p className="card-text">{content.description}</p>
                  <Button
                    variant="primary"
                    className="mt-2 w-100"
                    onClick={() => handleShowKomentar(content.id)}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="dark" className="text-center">
          Tidak ada video untukmu saat ini ☹️
        </Alert>
      )}

      <Modal
        show={!!selectedContent}
        onHide={() => setSelectedContent(null)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Komentar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedContent && (
            <>
              <Stack gap={2}>
                <img
                  src={getThumbnail(selectedContent.thumbnail)}
                  alt="Thumbnail"
                  className="w-100 h-100 object-fit-cover"
                />
                <h3 className="fw-bold"><i class="bi bi-camera-video-fill"></i> {selectedContent.title}</h3>
                <p>{selectedContent.description}</p>
              </Stack>

              <h5 className="mt-4">Komentar</h5>
              <Button variant="primary" onClick={handleOpenModal}>
              <i class="bi bi-plus-square-fill"></i> Tambahkan Komentar
              </Button>

              {isKomentarLoading ? (
                <div className="text-center mt-3">
                  <Spinner animation="border" variant="primary" size="lg" />
                  <h6 className="mt-2">Loading...</h6>
                </div>
              ) : komentar?.length > 0 ? (
                <Stack gap={3} className="mt-3">
                  {komentar.map((comment) => (
                    <div
                      key={comment.id}
                      className="d-flex align-items-start justify-content-between border-bottom pb-2 mb-2"
                    >
                      <div className="d-flex align-items-start flex-grow-1">
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          border: "1px solid",
                          backgroundColor: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "10px",
                        }}
                      >
                        <i className="bi bi-person-fill" style={{ fontSize: "2em", color: "#ccc" }}></i>
                      </div>
                        <div>
                          <div className="fw-bold">@{username || "Guest"}</div>
                          <div>{comment.comment}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center text-end">
                        <div className="text-muted small me-3">
                          {new Intl.DateTimeFormat("id-ID", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(comment.date_added))}
                        </div>
                        <Stack direction="horizontal" gap={2}>
                          <ModalEditKomentar
                            komentar={comment}
                            onClose={() => fetchKomentar(selectedContent.id)}
                          />
                          {isPending ? (
                            <Button variant="danger" disabled>
                              <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              Loading...
                            </Button>
                          ) : (
                            <Button
                              variant="danger"
                              onClick={() => deleteKomentar(comment.id)}
                            >
                              <FaTrash className="mx-1 mb-1" />
                            </Button>
                          )}
                        </Stack>
                      </div>
                    </div>
                  ))}
                </Stack>
              ) : (
                <Alert variant="dark" className="text-center mt-3">
                  Belum ada komentar, ayo tambahin komentar!
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
      {showCreateModal && (
        <ModalCreateKomentar
          contentId={selectedContent?.id}
          onClose={handleCloseModal}
        />
      )}
    </Container>
  );
};

export default DashboardPage;
