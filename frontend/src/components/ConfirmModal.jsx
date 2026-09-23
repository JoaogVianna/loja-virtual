function ConfirmModal({ mensagem, onConfirmar, onCancelar }) {
  if (!mensagem) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p>{mensagem}</p>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button className="btn-danger" style={{ flex: 1 }} onClick={onConfirmar}>
            Confirmar
          </button>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;