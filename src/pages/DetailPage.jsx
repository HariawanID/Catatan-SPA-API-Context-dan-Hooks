import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArchiveButton from "../components/ArchiveButton";
import UnarchiveButton from "../components/UnarchivedButton";
import { archiveNote, deleteNote, getNote, unarchiveNote } from "../utils/api";
import DeleteButton from "../components/DeleteButton";
import NoteDetail from "../components/NoteDetail";
import { PropTypes } from "prop-types";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DetailPage = () => {
  const { id } = useParams();
  const [note, setNote] = React.useState();
  const navigate = useNavigate();

  React.useEffect(() => {
    async function getNoteId() {
      const { error, data } = await getNote(id);
      !error && setNote(data);
    }
    getNoteId();
  }, []);

  const onDeleteSwalHandler = () => {
    Swal.fire({
      title: "Apakah kamu yakin ingin menghapus ???",
      text: "Setelah terhapus, Anda tidak dapat mengembalikan catatan!",
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: "Iya",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteEventHandler(id);
      }
    });
  }

  const onDeleteEventHandler = async (id) => {
    const { error } = await deleteNote(id);
    if (!error) {
      navigate("/");
      toast("Catatan Berhasil Dihapus !");
    }
    if (error) {
      toast(error);
    }
  };

  const onArchiveEventHandler = async (id) => {
    const { error } = await archiveNote(id);
    if (!error) {
      toast("Catatan Berhasil Dihapus !");
      navigate("/archive");
    }
  };

  const onUnarchiveEventHandler = async (id) => {
    const { error } = await unarchiveNote(id);
    if (!error) {
      navigate("/");
    }
  };

  if (note !== undefined) {
    return (
      <section className="detail-page">
        <NoteDetail {...note} />
        <div className="detail-page__action">
          {note.archived ? (
            <UnarchiveButton id={id} onUnarchive={onUnarchiveEventHandler} />
          ) : (
            <ArchiveButton id={id} onArchive={onArchiveEventHandler} />
          )}
          <DeleteButton id={id} onDelete={onDeleteSwalHandler} />
        </div>
      </section>
    );
  }
};

DetailPage.propTypes = {
  id: PropTypes.string,
};

export default DetailPage;
