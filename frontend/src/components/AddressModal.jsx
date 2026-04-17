import { useState, useEffect } from 'react';

function AddressModal({ isOpen, address, onClose, onSave }) {
  const [formAddress, setFormAddress] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormAddress(address || {});
    }
  }, [isOpen, address]);

  if (!isOpen) return null;

  function handleChange(field, value) {
    setFormAddress(prev => ({
      ...prev,
      [field]: value
    }));
  }

  function handleSubmit() {
    onSave(formAddress);
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Endereço de entrega</h3>

        <input
          placeholder="Rua"
          value={formAddress.street || ''}
          onChange={e => handleChange('street', e.target.value)}
        />

        <input
          placeholder="Número"
          value={formAddress.number || ''}
          onChange={e => handleChange('number', e.target.value)}
        />

        <input
          placeholder="Bairro"
          value={formAddress.neighborhood || ''}
          onChange={e => handleChange('neighborhood', e.target.value)}
        />

        <input
          placeholder="Cidade"
          value={formAddress.city || ''}
          onChange={e => handleChange('city', e.target.value)}
        />

        <input
          placeholder="Estado"
          value={formAddress.state || ''}
          onChange={e => handleChange('state', e.target.value)}
        />

        <input
          placeholder="CEP"
          value={formAddress.zipCode || ''}
          onChange={e => handleChange('zipCode', e.target.value)}
        />

        <input
          placeholder="Complemento"
          value={formAddress.complement || ''}
          onChange={e => handleChange('complement', e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={handleSubmit}>Salvar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default AddressModal;