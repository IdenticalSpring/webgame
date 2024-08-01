import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const QuyThi = () => {
  return (
    <Container>
      <Title>Quỷ thị</Title>
      {/* Add your QuyThi content here */}
    </Container>
  );
};

export default QuyThi;
