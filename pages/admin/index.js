import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import UserManagement from '@/components/admin-components/UserManagement';
import ClanManagement from '@/components/admin-components/ClanManagement';
import LevelManagement from '@/components/admin-components/LevelManagement';
import ClanPremissionManagement from '@/components/admin-components/ClanPremissionManagement';
import VatPhamManagement from '@/components/admin-components/VatPhamManagement';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 100px);
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #B3D7E8;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ddd;
`;

const SidebarSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.div`
  cursor: pointer;
  font-weight: bold;
  padding: 10px;
  background-color: #93B6C8;
  color: black;
  border-radius: 4px;
  border: solid gray 1px;
  margin-bottom: 5px;

  &:hover {
    background-color: #45a049;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: white;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: none;
  background-color: #4CAF50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  text-align: left;

  &:hover {
    background-color: #45a049;
  }

  &.active {
    background-color: #2e7d32;
  }
`;

const AdminPage = () => {
  const [selectedSection, setSelectedSection] = useState('userManagement');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === 1) {
        setUser(parsedUser);
      } else {
        router.push('/');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return null;

  return (
    <Layout>
      <Container>
        <Sidebar>
          <SidebarSection>
            <SectionTitle onClick={() => setSelectedSection('userManagement')}>Quản lý người dùng</SectionTitle>
            <SectionTitle onClick={() => setSelectedSection('clanManagement')}>Quản lý bang hội</SectionTitle>
            <SectionTitle onClick={() => setSelectedSection('clanPermissionManagement')}>Quản lý quyền hạn bang</SectionTitle>
            <SectionTitle onClick={() => setSelectedSection('levelManagement')}>Quản lý cấp độ</SectionTitle>
            <SectionTitle onClick={() => setSelectedSection('vatPhamManagement')}>Quản lý vật phẩm</SectionTitle> 
          </SidebarSection>
          <Button onClick={handleLogout}>Đăng xuất</Button>
        </Sidebar>
        <MainContent>
          {selectedSection === 'userManagement' && <UserManagement />}
          {selectedSection === 'clanManagement' && <ClanManagement />}
          {selectedSection === 'clanPermissionManagement' && <ClanPremissionManagement />}
          {selectedSection === 'levelManagement' && <LevelManagement />}
          {selectedSection === 'vatPhamManagement' && <VatPhamManagement />} 
        </MainContent>
      </Container>
    </Layout>
  );
};

export default AdminPage;
