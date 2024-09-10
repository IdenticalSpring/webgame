import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import BoltIcon from "@mui/icons-material/Bolt";
import { Bolt, Error } from "@mui/icons-material";
import ErrorIcon from "@mui/icons-material/Error";
import {
  levelItemChances,
  consistentItemChances,
} from "@/utils/levelItemChances";
import { useRouter } from "next/router";

const Container = styled.div`
  background: white;
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding: 12px;
  border-radius: 0;
  margin-bottom: 20px;
  width: 100%;
  border: 1px solid #93b6c8;
  box-sizing: border-box;
  font-size: 16px;
`;

const GlowingText = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: white !important;
  margin-bottom: 10px;
  text-shadow: 0 0 5px rgba(255, 191, 0, 0.8), 0 0 10px rgba(255, 191, 0, 0.6) !important;
`;

const MainContent = styled.div`
  flex: 1;
`;

const InfoContent = styled.div`
  padding: 0;
  border-radius: 8px;
`;

const Title = styled.h2`
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

const ProgressBar = styled.div`
  width: 100%;
  background: #e0e0e0;
  overflow: hidden;
  margin-bottom: 20px;
`;

const Progress = styled.div`
  width: ${({ width }) => width}%;
  background: #4caf50;
  height: 20px;
`;

const Info = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
.cap-1 { /* Luyện Khí */
    color: #9820D0;
}
.cap-2 { /* Trúc Cơ */
    color: #4B0082;
}
.cap-3 { /* Kim Đan */
    color: #3755D6;
}
.cap-4 { /* Nguyên Anh */
    color: #008A00;
}
.cap-5 { /* Hóa Thần */
    color: #E2CD19;
}
.cap-6 { /* Luyện Hư */
    color: #FFA500;
}
.cap-7 { /* Hợp Thể */
    color: #C12A1C;
}
.cap-8 { /* Đại Thừa */
    color: #61CBF3;
}
.cap-9 { /* Độ Kiếp */
    color: #DAA520; /* Goldenrod */
}
.cap-10 { /* Nhân Tiên */
    text-shadow:none;
    background: #E0B700 -webkit-gradient(linear, left top, right top,
from(#E0B700), to(#E0B700), color-stop(0.5, #ffffff)) 0 0 no-repeat;
    color: rgba(255, 255, 255, 0.1);

    font-weight: bold;
    position: relative;
 
    -webkit-animation: shine 2s infinite;
    -webkit-background-clip: text;
    -webkit-background-size: 30px;
}
.cap-11 { /* Địa Tiên */
    text-shadow:none;
    background: #CD853F -webkit-gradient(linear, left top, right top,
from(#CD853F), to(#CD853F), color-stop(0.5, #ffffff)) 0 0 no-repeat;
    color: rgba(255, 255, 255, 0.1);

    font-weight: bold;
    position: relative;
 
    -webkit-animation: shine 2s infinite;
    -webkit-background-clip: text;
    -webkit-background-size: 30px;
}
.cap-12 { /* Thiên Tiên */
    text-shadow:none;
    background: rgb(37 169 158) -webkit-gradient(linear, left top, right top, from(#4a17af), to(#ba603f), color-stop(0.5, #ffffff)) 0 0 no-repeat;
    color: rgba(255, 255, 255, 0.1);
    font-weight: bold;
    position: relative;
 
    -webkit-animation: shine 2s infinite;
    -webkit-background-clip: text;
    -webkit-background-size: 30px;
}
.cap-13 { /* Thượng Tiên */
    text-shadow:none;
    background: #CD853F -webkit-gradient(linear, left top, right top,
from(#CD853F), to(#CD853F), color-stop(0.5, #ffffff)) 0 0 no-repeat;
    color: rgba(255, 255, 255, 0.1);

    font-weight: bold;
    position: relative;
 
    -webkit-animation: shine 2s infinite;
    -webkit-background-clip: text;
    -webkit-background-size: 30px;
}
.cap-14 { /* Đại La Tiên */
    text-shadow:none;
    background: #CD853F -webkit-gradient(linear, left top, right top,
from(#CD853F), to(#CD853F), color-stop(0.5, #ffffff)) 0 0 no-repeat;
    color: rgba(255, 255, 255, 0.1);

    font-weight: bold;
    position: relative;
 
    -webkit-animation: shine 2s infinite;
    -webkit-background-clip: text;
    -webkit-background-size: 30px;
}
  span {
    color: #00000;
    font-weight: bold;
  }
    @-webkit-keyframes shine {
  0% {
    background-position: -100px;
  }
  100% {
    background-position: 100px;
  }
}
`;

const MandatoryItems = styled.div`
  margin: 10px 0;
  color: red;
  font-weight: bold;
`;

const DotPhaButton = styled.button`
  background: ${({ disabled }) => (disabled ? "#ccc" : "#f44336")};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-size: 16px;
  margin-top: 20px;
  width: 100%;
`;

const Notice = styled.div`
  margin-top: 20px;
  font-size: 12px;
  color: #555;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: row;
  @media (max-width: 749px) {
    flex-direction: column;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const CheckboxLabel = styled.label`
  margin-left: 8px;
`;

const ContainerWrapper = styled.div``;

const Exp = styled.div``;
const ExpPercent = styled.div``;

const DotPha = () => {
  const [user, setUser] = useState(null);
  const [levelData, setLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});
  const router = useRouter();
  const [validItems, setValidItems] = useState([]);

  useEffect(() => {
    const validateTokenAndFetchItems = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const { data } = await axios.get("/api/user/validate-token", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!data.isValid) {
          router.push("/login");
          return;
        }

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
          const { data: userData } = await axios.get(
            `/api/user/clan/user-info?userId=${storedUser.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(userData);

          const { data: fetchedLevelData } = await axios.post(
            `/api/user/dot-pha/level-info`,
            { level: userData.level },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setLevelData(fetchedLevelData);

          fetchValidItems(userData, token, fetchedLevelData.level);
        }
        // else {
        //   router.push("/login");
        // }
      } catch (error) {
        console.error("Error validating token or fetching data:", error);
        // router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    validateTokenAndFetchItems();
  }, [router]);

  const fetchValidItems = async (userData, token, level) => {
    try {
      let itemIds;
      // if (level === 0) {
      //   itemIds = ["41", "42", "43", "44", "45"];
      // } else {
      //   itemIds = ["38", "39", "40", "41", "42", "43", "44", "45"];
      // }
      if (level === 0) {
        itemIds = ["47", "48", "49", "50", "51"];
      } else {
        itemIds = ["44", "45", "46", "47", "48", "49", "50", "51"];
      }

      if (itemIds.length > 0) {
        const { data: validItemsData } = await axios.get(
          `/api/user/dot-pha/check-used-items`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              userId: userData.id,
              usedItemIds: itemIds.join(","),
            },
          }
        );
        setValidItems(validItemsData);
      }
    } catch (error) {
      console.error("Error fetching valid items:", error);
    }
  };

  const handleCheckboxChange = (itemId) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId],
    }));
  };

  const logUserActivity = async (actionType, actionDetails) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        "/api/user/log/dot-pha-log",
        { actionType, actionDetails },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error logging user activity:", error);
    }
  };

  const logClanActivity = async (actionType, actionDetails) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        "/api/user/log/dot-pha-clan-log",
        { actionType, actionDetails },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error logging user activity:", error);
    }
  };

  const handleLevelUp = async () => {
    if (user && levelData && user.exp >= levelData.exp) {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const requiredItemIds = levelData.vatpham_bat_buoc_id
          ? levelData.vatpham_bat_buoc_id.split(",")
          : [];

        if (requiredItemIds.length > 0) {
          const { data: requiredItemsData } = await axios.get(
            `/api/user/dot-pha/check-required-item`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                userId: user.id,
                itemIds: requiredItemIds.join(","),
              },
            }
          );

          if (!requiredItemsData.hasRequiredItems) {
            alert("Bạn không có đủ vật phẩm bắt buộc để Đột Phá.");
            return;
          }
        }

        const nextLevel = user.level + 1;

        const newTaiSan = user.tai_san + levelData.bac_nhan_duoc_khi_dot_pha;

        let successChance = levelData.ty_le_dot_pha_thanh_cong;

        const levelRangeKey = Object.keys(levelItemChances).find((range) => {
          const [min, max] = range.split("-").map(Number);
          return user.level >= min && user.level <= max;
        });

        const selectedItems = Object.keys(checkedItems).filter(
          (itemId) => checkedItems[itemId]
        );

        if (selectedItems.length > 0) {
          const { data: usedItemsData } = await axios.get(
            `/api/user/dot-pha/check-used-items`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                userId: user.id,
                usedItemIds: selectedItems.join(","),
              },
            }
          );
          await axios.post(
            `/api/user/dot-pha/decrement-item`,
            {
              userId: user.id,
              itemIds: selectedItems.join(","),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const usedItemsLog = usedItemsData
            .map((item) => `${getItemNameById(item.vat_pham_id)} x1`)
            .join(", ");
          await logUserActivity("Item Use", `đã sử dụng: ${usedItemsLog}`);

          usedItemsData.forEach((item) => {
            const itemChance =
              levelItemChances[levelRangeKey]?.[item.vat_pham_id] ||
              consistentItemChances[item.vat_pham_id];
            if (itemChance) {
              successChance += itemChance;
            }
          });
        }

        const randomValue = Math.round(Math.random() * 100);
        if (randomValue <= successChance) {
          const levelUpResponse = await axios.post(
            "/api/user/dot-pha/level-up",
            {
              userId: user.id,
              newLevel: nextLevel,
              newTaiSan,
              expUsed: levelData.exp,
              currentExp: user.exp,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUser((prevUser) => ({
            ...prevUser,
            level: nextLevel,
            exp: prevUser.exp - levelData.exp,
            tai_san: newTaiSan,
          }));

          const { data: fetchedLevelData } = await axios.post(
            `/api/user/dot-pha/level-info`,
            { level: nextLevel },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setLevelData(fetchedLevelData);

          alert('Đột phá thành công")

          await logUserActivity(
            "Dot Pha Success",
            `đã đột phá thành công, tấn thăng ${fetchedLevelData.tu_vi}, nhận được ${levelData.bac_nhan_duoc_khi_dot_pha} bạc và ${levelUpResponse.data.item.Name} (Còn ${levelUpResponse.data.so_luong})`
          );
          await logClanActivity(
            "Dot Pha Success",
            `đã đột phá thành công, tấn thăng ${fetchedLevelData.tu_vi}, nhận được ${levelData.bac_nhan_duoc_khi_dot_pha} bạc và ${levelUpResponse.data.item.Name}`
          );
        } else {
          const nextLevel = user.level;
          const { data: fetchedLevelData } = await axios.post(
            `/api/user/dot-pha/level-info`,
            { level: nextLevel },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setLevelData(fetchedLevelData);
          const expLoss = Math.floor(
            levelData.exp * (levelData.dot_pha_that_bai_mat_exp_percent / 100)
          );
          const newExp = Math.max(0, user.exp - expLoss);

          setUser((prevUser) => ({
            ...prevUser,
            exp: newExp,
          }));

          alert(
            `Rất tiếc, đạo hữu chưa đủ may mắn để có thể tiến cấp, vui lòng tu luyện thêm!`
          );

          await logUserActivity(
            "Dot Pha Fail",
            `chưa đủ cơ duyên để đột phá ${fetchedLevelData.tu_vi} (${randomValue}), mất ${expLoss} kinh nghiệm`
          );
        }
      } catch (error) {
        alert(
          error.response?.data?.message || "Đã xảy ra lỗi trong quá trình học."
        );
      }
    }
  };

  if (loading) {
    return <Container>Loading...</Container>;
  }

  if (!user || !levelData) {
    return <Container>Error loading data.</Container>;
  }

  const expProgress1 = Math.min((user.exp / levelData.exp) * 100, 100);
  const cap = Math.floor((user.level - 1) / 10) + 1;
  const expProgress = (user.exp / levelData.exp) * 100;
  const canLevelUp = user.exp >= levelData.exp;
  const isDoKiep = user.level % 10 === 0;
  const getCapClass = (cap) => {
    return `cap-${cap}`;
  };
  const levelRangeKey = Object.keys(levelItemChances).find((range) => {
    const [min, max] = range.split("-").map(Number);
    return user.level >= min && user.level <= max;
  });

  return (
    <>
      <Wrapper>
        <ContainerWrapper>
          <Title>
            <Bolt /> ĐỘT PHÁ & ĐỘ KIẾP
          </Title>
          <Container>
            <MainContent>
              <Info>
                Cảnh giới hiện tại:{" "}
                {user.id === 3 ? (
                  <GlowingText>Thiên Đạo</GlowingText>
                ) : (
                 <span className={getCapClass(cap)}>{levelData.tu_vi}</span>
                )}
              </Info>

              <Info>Tiến độ tu luyện</Info>
              <Info>
                <Exp>
                  {user.exp}/{levelData.exp}
                </Exp>
                <ExpPercent>{expProgress1}%</ExpPercent>
              </Info>
              <ProgressBar>
                <Progress width={expProgress} />
              </ProgressBar>

              <MandatoryItems>
                Vật phẩm bắt buộc:{" "}
                <MandatoryItems
                  dangerouslySetInnerHTML={{
                    __html: levelData.vatpham_bat_buoc,
                  }}
                />
              </MandatoryItems>
              <Info>Vật phẩm phụ trợ tăng tỉ lệ thành công:</Info>

              {[
                ...new Set(
                  validItems
                    .filter((item) => item.so_luong > 0)
                    .map((item) => item.vat_pham_id)
                ),
              ].map((uniqueId) => {
                const item = validItems.find((v) => v.vat_pham_id === uniqueId);

                return (
                  <CheckboxContainer key={item.vat_pham_id}>
                    <input
                      type="checkbox"
                      id={`item-${item.vat_pham_id}`}
                      checked={!!checkedItems[item.vat_pham_id]}
                      onChange={() => handleCheckboxChange(item.vat_pham_id)}
                    />
                    <CheckboxLabel htmlFor={`item-${item.vat_pham_id}`}>
                      {getItemNameById(item.vat_pham_id)} (
                      {(() => {
                        const levelChance =
                          levelItemChances[levelRangeKey]?.[item.vat_pham_id];
                        const consistentChance =
                          consistentItemChances[item.vat_pham_id];
                        console.log(
                          `Item ID: ${item.vat_pham_id}, Level Chance: ${levelChance}, Consistent Chance: ${consistentChance}`
                        );

                        return levelChance !== null && levelChance !== undefined
                          ? levelChance
                          : consistentChance !== undefined
                          ? consistentChance
                          : 0;
                      })()}
                      % )
                    </CheckboxLabel>
                  </CheckboxContainer>
                );
              })}

              <DotPhaButton onClick={handleLevelUp} disabled={!canLevelUp}>
                {isDoKiep ? "Độ kiếp" : "Đột phá"}
              </DotPhaButton>
              <Notice>
                - Các vật phẩm dùng để đột phá cảnh giới có thể kiếm tại vòng
                quay may mắn hoặc mua tại Hắc Thị
                <br />
                - Nếu đẳng cấp vật phẩm phụ trợ đạo hữu sử dụng thấp hơn tu vi
                hiện tại thì tỉ lệ tăng kinh nghiệm sẽ bị giảm xuống, trừ công
                pháp Vô Cấp
                <br />- Nếu đột phá thất bại, đạo hữu sẽ bị mất{" "}
                {levelData.dot_pha_that_bai_mat_exp_percent}% kinh nghiệm
              </Notice>
            </MainContent>
          </Container>
        </ContainerWrapper>
        <ContainerWrapper>
          <Title>
            <Error /> CẦN BIẾT
          </Title>
          <Container>
            <InfoContent>
              <p>
                Đạo hữu có thể tu luyện tăng kinh nghiệm bằng cách đọc truyện,
                bình luận bằng tài khoản truyencv, chơi game, tặng đấu, ném đá
                hoặc cắn thuốc.
              </p>
              <p>
                Lưu ý không được spam comment để cày kinh nghiệm, spam sẽ bị ban
                nick từ 1 tới 7 ngày tùy mức độ.
              </p>
              <p>
                Đạo hữu đang nhận kinh nghiệm nhanh hơn 0% so với người thường
                khi đọc truyện hoặc treo tài khoản tại Nghi Sự Đường.
              </p>
              <p>
                Nếu đẳng cấp công pháp đạo hữu đang sử dụng thấp hơn tu vi hiện
                tại thì tốc độ tăng kinh nghiệm sẽ bị giảm xuống, trừ công pháp
                Vô Cấp.
              </p>
              <p>
                Đọc truyện trên Động Thiên Phúc Địa App dùng app để đọc truyện
                sẽ được kinh nghiệm nhanh hơn tu luyện trên web.
              </p>
            </InfoContent>
          </Container>
        </ContainerWrapper>
      </Wrapper>
    </>
  );
};

export default DotPha;

const getItemNameById = (itemId) => {
  const itemNames = {
    83: "Huyết Khí Đan",
    44: "Đê Giai Thuẫn",
    45: "Tị Lôi Châu",
    46: "Thanh Tâm Đan",
    47: "Hộ Linh Trận",
    48: "Tán Lôi Trận",
    49: "Sa Ngọc Châu",
    80: "Hoàng Kim Lệnh",
    51: "Hoả Ngọc Châu",
    50: "Thải Ngọc Châu",
  };
  return itemNames[itemId] || `Item ${itemId}`;
};
// const getItemNameById = (itemId) => {
//   const itemNames = {
//     35: "Huyết Khí Đan",
//     38: "Đế Giai Thuẫn",
//     39: "Tị Lôi Châu",
//     40: "Thanh Tâm Đan",
//     41: "Hộ Linh Trận",
//     42: "Tân Lôi Trận",
//     43: "Sa Ngọc Châu",
//     44: "Hoàng Kim Lệnh",
//     45: "Hoả Ngọc Châu",
//   };
//   return itemNames[itemId] || `Item ${itemId}`;
// };
