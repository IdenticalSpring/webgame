import { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import styled from 'styled-components';

const StyledBox = styled(Box)`
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  max-width: 500px;
  margin: 0 auto;
`;

const StyledButton = styled(Button)`
  && {
    background-color: #93B6C8;
    color: white;
    &:hover {
      background-color: #45a049;
    }
  }
`;

const ClanEditModal = ({ clan, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: clan.id,
    name: clan.name,
    owner: clan.owner
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal open onClose={onClose}>
      <StyledBox>
        <Typography variant="h5" gutterBottom>
          Chỉnh sửa Bang hội
        </Typography>
        <TextField
          label="ID"
          name="id"
          value={formData.id}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Tên"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Chủ sở hữu"
          name="owner"
          value={formData.owner}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box mt={2}>
          <StyledButton onClick={handleSave} variant="contained">
            Lưu
          </StyledButton>
          <Button onClick={onClose} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
            Hủy
          </Button>
        </Box>
      </StyledBox>
    </Modal>
  );
};

export default ClanEditModal;
