import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border: 1px solid #93b6c8;
  background-color: white;
  width: 100%;
  box-sizing: border-box;
`;

const SectionTitle = styled.h3`
  margin-bottom: 20px;
  margin-top: 0;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  background-color: white;
  width: 100%;
  padding: 11px 20px;
  border: 1px solid #93b6c8;
  box-sizing: border-box;
  flex-direction: row;
  gap: 5px;
`;

const StatusContainer = styled.div`
  background-color: #e0f4e5;
  border: 1px solid #b3d7e8;
  padding: 15px;
  border-radius: 8px;
`;

const Status = styled.p`
  margin: 0;
  color: #333;
  font-size: 16px;
`;

const InstructionContainer = styled.div`
  background-color: #d1e7dd;
  padding: 15px;
`;

const Instruction = styled.p`
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #ffc107;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  text-align: center;

  &:hover {
    background-color: #e0a800;
  }
`;

const Mission = styled.div`
  font-size: 16px;
  border: 1px solid #b3d7e8;
  padding: 10px;
`;

const MissionDetail = styled.div`
  display: flex;
  flex-direction: row;
`;

const MissionButton = styled.button`
  width: 80px;
  background-color: ${({ active }) => (active ? "green" : "gray")};
  padding: 8px 12px;
  color: white;
  border: none;
  cursor: ${({ active }) => (active ? "pointer" : "not-allowed")};
  font-size: 16px;
  text-align: center;
  margin-bottom: 5px;
  &:hover {
    background-color: ${({ active }) => (active ? "#e0a800" : "gray")};
  }
  @media (max-width: 749px) {
    width: 60px;
  }
`;

const Progress = styled.div`
  padding: 10px 0;
`;

const MissionStatus = styled.div`
  color: ${({ status }) => {
    if (status === "on going") return "blue";
    if (status === "failed") return "red";
    if (status === "success") return "green";
    return "black";
  }};
`;

const MienButton = styled.button`
  width: 60px;
  padding: 8px 12px;
  color: white;
  background-color: green;
  border: none;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  margin-right: 5px;
  margin-bottom: 5px;
  &:hover {
    background-color: darkgreen;
  }
`;

const HuyButton = styled.button`
  width: 60px;
  padding: 8px 12px;
  color: white;
  background-color: red;
  border: none;
  cursor: pointer;
  font-size: 16px;
  text-align: center;

  &:hover {
    background-color: darkred;
  }
`;

const Table = styled.table`
  box-sizing: border-box;
  border-collapse: collapse;
  table-layout: fixed;
  @media (max-width: 749px) {
    font-size: 12px;
  }
`;

const Td = styled.td`
  border-bottom: 1px dashed #93b6c8;
  padding: 6px;
  text-align: left;
`;

const Th = styled.th`
  border-bottom: 2px solid #93b6c8;
  padding: 6px;
  text-align: center;
`;

const Tr = styled.tr`
  border-bottom: 1px dashed #93b6c8;
  &:last-child {
    border-bottom: none;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const reloadPage = (time) => {
  window.history.go(time);
};

const NhiemVuDuong = () => {
  const [missions, setMissions] = useState([]);
  const [status, setStatus] = useState("");

  const fetchMissions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.get("/api/user/nhiem-vu/nhiem-vu", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.missions && response.data.missions.length > 0) {
        setMissions(response.data.missions);
      } else {
        setMissions([]);
      }
    } catch (error) {
      setStatus(error.response?.data?.message || "Error fetching missions");
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleNhanNhiemVu = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.post(
        "/api/user/nhiem-vu/nhan-nhiem-vu",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
      reloadPage(0);
    } catch (error) {
      console.error("Error receiving mission:", error);
      setStatus(error.response?.data?.message || "Error receiving mission");
    }
  };

  const handleNhanQua = async (missionId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.post(
        `/api/user/nhiem-vu/nhan-qua`,
        { missionId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }
      setMissions([]);
    } catch (error) {
      // console.error("Error claiming reward:", error);
      // setStatus(error.response?.data?.message || "Error claiming reward");
      alert(error.response?.data?.message || "Error claiming reward");
      setMissions([]);
    }
  };

  const renderMissionButton = (mission) => {
    const buttonText = mission.giftReceive ? "Đã trả" : "Trả";
    let isButtonActive = false;
    let time_repeat = mission.time_repeat;
    let count = mission.count;

    if (count >= time_repeat) {
      isButtonActive = true;
    }
    const isDisabled = false;

    return (
      <ButtonRow>
        <MissionButton
          color="#ffc107"
          hoverColor="#e0a800"
          onClick={() => handleNhanQua(mission.id)}
          active={isButtonActive}
          disabled={!isButtonActive}
        >
          {buttonText}
        </MissionButton>
        <MienButton
          onClick={() => handleMien(mission.id)}
          disabled={isDisabled}
        >
          Miễn
        </MienButton>
        <HuyButton onClick={() => handleHuy(mission.id)} disabled={isDisabled}>
          Hủy
        </HuyButton>
      </ButtonRow>
    );
  };

  const formatTimeAgo = (date) => {
    return moment(date).fromNow();
  };
  const handleMien = async (missionId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.post(
        `/api/user/nhiem-vu/mien`,
        { missionId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setStatus(response.data.message);
      } else {
        setStatus(
          response.data.message || `Không thể miễn cho nhiệm vụ: ${missionId}`
        );
      }
      setMissions([]);
    } catch (error) {
      console.error("Error updating mission count:", error);
      setStatus(
        error.response?.data?.message || "Error updating mission count"
      );
    }
  };

  const handleHuy = async (missionId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    if (confirm("Bạn có muốn huỷ nhiệm vụ này")) {
      try {
        const response = await axios.post(
          `/api/user/nhiem-vu/give-up`,
          { missionId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setStatus(response.data.message);
          setMissions([]);
        } else {
          setStatus(response.data.message);
        }
        // reloadPage(0);
      } catch (error) {
        console.error("Error cancelling mission:", error);
        setStatus(error.response?.data?.message || "Error cancelling mission");
      }
    }
  };

  const renderMissionTable = () => {
    return (
      <Table>
        <thead>
          <tr>
            <Th>Nội dung nhiệm vụ</Th>
            <Th>Phần thưởng</Th>
            <Th>Nhận lúc</Th>
            <Th>Phải trả lúc</Th>
            <Th>Trả/Hủy nhiệm vụ</Th>
          </tr>
        </thead>
        <tbody>
          {missions
            // .filter((mission) => mission.status === "on going")
            .map((mission) => (
              <tr key={mission.id}>
                <Td>{mission.detail}</Td>
                <Td>{mission.prize}</Td>
                <Td>
                  {moment(mission.created_at).format("MM/DD/YYYY HH:mm:ss")}
                </Td>
                <Td>{moment(mission.endAt).format("MM/DD/YYYY HH:mm:ss")}</Td>
                <Td>{renderMissionButton(mission)}</Td>
              </tr>
            ))}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      <SectionTitle>
        <AssignmentOutlinedIcon />
        NHIỆM VỤ ĐƯỜNG
      </SectionTitle>

      <Container>
        <InstructionContainer>
          <Instruction>
            - Tùy vận mà đạo hữu sẽ nhận được nhiệm vụ dễ hay khó.
          </Instruction>
          <Instruction>
            - Tùy mỗi nhiệm vụ mà thời gian trả nhiệm vụ sẽ khác nhau.
          </Instruction>
          <Instruction>
            - Tùy tu vi mà số lần nhận được nhiệm vụ trong ngày sẽ khác nhau.
          </Instruction>
          <Instruction>
            - Với mỗi lần hoàn thành nhiệm vụ, đạo hữu sẽ được 1 vào chuỗi nhiệm
            vụ, khi chuỗi nhiệm vụ đạt tới các mốc 50, 100, 150, ..., đạo hữu sẽ
            nhận thêm bonus 50k bạc từ hệ thống.
          </Instruction>
          <Instruction>
            - Khi hủy hoặc trả nhiệm vụ trễ chuỗi nhiệm vụ đều sẽ bị reset về 0,
            có thể dùng Băng Hóa Ngọc để miễn làm nhiệm vụ khó và không bị reset
            chuỗi nhiệm vụ.
          </Instruction>
        </InstructionContainer>
        <Button onClick={handleNhanNhiemVu}>Nhận nhiệm vụ</Button>
        {status && <p>{status}</p>}
        {missions.length > 0 ? (
          <div>{renderMissionTable()}</div>
        ) : (
          <p>Hiện tại không có nhiệm vụ nào.</p>
        )}{" "}
      </Container>
    </>
  );
};

export default NhiemVuDuong;
