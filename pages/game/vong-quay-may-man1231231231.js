// import React, { useState, useEffect } from "react";
// import styled, { keyframes, css } from "styled-components";
// import dynamic from "next/dynamic";
// import Layout from "../../components/Layout";
// import CboxGeneral from "@/components/CboxGeneral";
// import moment from "moment";

// const Wheel = dynamic(
//   () => import("react-custom-roulette").then((mod) => mod.Wheel),
//   { ssr: false }
// );

// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 0;
//   width: 100%;
//   min-height: 100vh;
// `;

// const WheelContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   position: relative;
//   padding: 0;
// `;
// const Image = styled.img`
//   z-index: -1;
//   position: absolute;
//   width: 800px;
//   @media (max-width: 749px) {
//     width: 500px;
//   }
// `;

// const Image2 = styled.img`
//   position: absolute;
//   width: 350px;
//   z-index: 100;
//   cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
//   pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
//   &:hover {
//     transform: ${({ disabled }) => (disabled ? 'none' : 'scale(1.1)')};
//   }
//   @media (max-width: 749px) {
//     width: 200px;
//   }
// `;


// const Button = styled.button`
//   padding: 10px 20px;
//   margin-top: 10vh;
//   background-color: ${({ disabled }) => (disabled ? "#cccccc" : "#b3d7e8")};
//   color: white;
//   border: none;
//   cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
//   font-weight: bold;
//   font-size: larger;
//   z-index: 2;
//   pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
// `;

// const LowerSection = styled.div`
//   margin-top: 40px;
//   display: flex;
//   flex-direction: row;
//   gap: 20px;
//   padding: 0;
//   height: 150vh;
//   min-height: 150vh;
//   flex-grow: 1;
//   @media (max-width: 749px) {
//     flex-direction: column;
//   }
// `;

// const LogContainer = styled.div`
//   width: calc(40vw + 1vw);
//   height: calc(40vh + 1vh);
//   border: 1px solid #93b6c8;
//   padding: 20px;
//   overflow-y: scroll;
//   background-color: white;
//   @media (max-width: 749px) {
//     width: 80vw;
//   }
// `;
// const LogTitle = styled.h2`
//   text-align: center;
//   margin-top: 0;
//   margin-bottom: 12px;
// `;
// const LogItem = styled.div`
//   padding: 8px;
//   border: 1px solid #93b6c8;
//   font-size: 14px;
// `;

// const OverlayImage = styled.img`
//   position: absolute;
//   width: 100px;
//   z-index: -1;

//   ${({ mustSpin, spinDuration }) =>
//     mustSpin &&
//     css`
//       animation: ${spinAnimation} ${spinDuration}s linear infinite;
//     `}

//   @media (max-width: 749px) {
//     width: 500px;
//   }
// `;

// const spinAnimation = keyframes`
//   from {
//     transform: rotate(0deg);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// `;

// const VongQuayMayManPage = () => {
//   const [wheelSlots, setWheelSlots] = useState([]);
//   const [mustSpin, setMustSpin] = useState(false);
//   const [prizeIndex, setPrizeIndex] = useState(0);
//   const [result, setResult] = useState(null);
//   const [spinLogs, setSpinLogs] = useState([]);
//   const [taiSan, setTaiSan] = useState(0);
//   const [spinDuration, setSpinDuration] = useState(3);
//   const formatTimeDifference = (timestamp) => {
//     const now = moment();
//     const logTime = moment(timestamp);
//     const duration = moment.duration(now.diff(logTime));

//     const hours = duration.asHours();
//     const minutes = duration.asMinutes();

//     if (hours >= 1) {
//       return `${Math.floor(hours)} giờ trước`;
//     } else {
//       return `${Math.floor(minutes)} phút trước`;
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     fetch("/api/admin/wheel-slot-groups", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((groups) => {
//         if (Array.isArray(groups)) {
//           fetch("/api/admin/wheel-slots", {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           })
//             .then((res) => res.json())
//             .then((slots) => {
//               if (Array.isArray(slots)) {
//                 const groupedSlots = groups.map((group) => ({
//                   option: group.group_name,
//                   style: {
//                     backgroundColor: group.background_color,
//                     textColor: group.text_color,
//                   },
//                   items: slots.filter(
//                     (slot) => slot.slot_number === group.slot_number
//                   ),
//                 }));
//                 setWheelSlots(groupedSlots);
//               }
//             });
//         }
//       });

//     fetch("/api/user/game/vong-quay/spin-logs", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((logs) => {
//         const formattedLogs = logs.map((log) => ({
//           ...log,
//           formattedTime: formatTimeDifference(log.timestamp),
//         }));
//         setSpinLogs(formattedLogs);
//       });
//   }, []);

//   const handleSpinClick = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const storedUser = JSON.parse(localStorage.getItem("user"));

//       const spinTokenResponse = await fetch("/api/user/game/vong-quay/spin-token", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userId: storedUser.id }),
//       });
      
//       const spinTokenData = await spinTokenResponse.json();
//       const spinToken = spinTokenData.spinToken;

//       const response = await fetch("/api/user/game/vong-quay/tai-san", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ userId: storedUser.id }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setTaiSan(data.tai_san);
//         const newPrizeIndex = Math.floor(Math.random() * wheelSlots.length);
//         setPrizeIndex(newPrizeIndex);
//         setMustSpin(true);
//         setSpinDuration(3);
//         return spinToken;
//       } else {
//         alert(data.message);
//       }
//     } catch (error) {
//       console.error("Error checking tai_san:", error);
//     }
//   };

//   const calculatePrize = (slot) => {
//     if (!slot) return "Error: Slot data missing";

//     if (slot.items[0]?.prize_type === 1) {
//       const itemWithBounds = slot.items[0];
//       const min = itemWithBounds.lower_bound;
//       const max = itemWithBounds.higher_bound;

//       if (min !== null && max !== null && min <= max) {
//         return Math.floor(Math.random() * (max - min + 1)) + min;
//       } else {
//         return "Invalid Range";
//       }
//     } else {
//       const items = slot.items || [];
//       let totalWeight = items.reduce((sum, item) => sum + item.prize_rate, 0);
//       let randomNum = Math.random() * totalWeight;

//       for (let item of items) {
//         if (randomNum < item.prize_rate) {
//           return item.option_text;
//         }
//         randomNum -= item.prize_rate;
//       }
//       return null;
//     }
//   };

//   const handlePrizeResult = async () => {
//     const selectedSlot = wheelSlots[prizeIndex];
//     const prizeValue = calculatePrize(selectedSlot);

//     if (!selectedSlot || !prizeValue) {
//       setResult("Error: Prize calculation failed");
//       setMustSpin(false);
//       return;
//     }

//     if (selectedSlot.items[0]?.prize_type === 1) {
//       await updateUserExpOrBac(selectedSlot.option, prizeValue);
//     } else if (selectedSlot.items[0]?.prize_type === 2) {
//       const vatPhamId = await getVatPhamId(prizeValue);

//       if (vatPhamId) {
//         await updateUserItem(vatPhamId, spinToken, 1);      }
//     }
//     await logSpinResult(selectedSlot.option, prizeValue);

//     setResult(prizeValue);
//     setMustSpin(false);
//   };

//   const logSpinResult = async (prizeCategory, prizeName, quantity) => {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         throw new Error("Token not found in local storage");
//       }

//       const response = await fetch("/api/user/game/vong-quay/spin-logs", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           prize_category: prizeCategory,
//           prize_name: prizeName,
//           quantity,
//         }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Failed to log spin result");
//       }

//       setSpinLogs((prevLogs) => [...prevLogs, data]);
//     } catch (error) {
//       console.error("Error logging spin result:", error);
//     }
//   };

//   function normalizePrizeName(prize) {
//     return prize
//       .toLowerCase()
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, "");
//   }

//   async function updateUserExpOrBac(prize, amount) {
//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         throw new Error("Token not found in local storage");
//       }

//       const normalizedPrize = normalizePrizeName(prize);

//       const response = await fetch("/api/user/game/vong-quay/exp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           prize: normalizedPrize,
//           amount,
//         }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Failed to update Exp/Bac");
//       }
//       console.log("User Exp/Bac updated successfully:", data);
//     } catch (error) {
//       console.error("Error updating Exp/Bac:", error);
//     }
//   }

//   async function updateUserItem(vat_pham_id, spinToken) {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         throw new Error("Token not found in local storage");
//       }

//       const storedUser = JSON.parse(localStorage.getItem("user"));

//       const userId = storedUser.id;

//       const response = await fetch("/api/user/game/vong-quay/item", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           userId,
//           vat_pham_id,
//           so_luong: 1,
//           spinToken, 
//         }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Failed to add item to Ruong Do");
//       }
//       console.log("Item added to Ruong Do successfully:", data);
//     } catch (error) {
//       console.error("Error updating Ruong Do:", error);
//     }
//   }

//   const handleMultiSpinClick = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const storedUser = JSON.parse(localStorage.getItem("user"));

//       while (taiSan > 0) {
//         const response = await fetch("/api/user/game/vong-quay/tai-san", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ userId: storedUser.id }),
//         });

//         const data = await response.json();

//         if (response.ok) {
//           setTaiSan(data.tai_san);

//           if (data.tai_san <= 0) break; 

//           const newPrizeIndex = Math.floor(Math.random() * wheelSlots.length);
//           setPrizeIndex(newPrizeIndex);
//           setMustSpin(true);

//           await new Promise((resolve) =>
//             setTimeout(resolve, spinDuration * 1000)
//           );

//           await handlePrizeResult();

//           setMustSpin(false);
//         } else {
//           alert(data.message);
//           break;
//         }
//       }
//     } catch (error) {
//       console.error("Error in multi-spin function:", error);
//     }
//   };

//   return (
//     <Layout>
//       <Container>
//         {wheelSlots.length > 0 && (
//           <>
//             <WheelContainer>
//               <Wheel
//                 mustStartSpinning={mustSpin}
//                 prizeNumber={prizeIndex}
//                 data={wheelSlots.map((slot) => ({
//                   option: slot.option,
//                   style: {
//                     ...slot.style,
//                     borderWidth: "1px",
//                     borderStyle: "solid",
//                     borderColor: "white",
//                   },
//                 }))}
//                 outerBorderWidth={1}
//                 outerBorderColor="gold"
//                 radiusLineColor="gold"
//                 radiusLineWidth={1}
//                 onStopSpinning={handlePrizeResult}
//               />
//               {/* <OverlayImage
//               src="/wheel/1.png"
//               alt="Overlay Image"
//               mustSpin={mustSpin}
//               spinDuration={spinDuration}
//             /> */}
//               <Image src="/spin/overlay2.png" alt="Image below the wheel" />
//               <Image2
//                 src="/spin/center.png"
//                 alt="Image below the wheel"
//                 onClick={handleSpinClick}
//                 disabled={mustSpin}
//               />
//             </WheelContainer>

//             <Button onClick={handleSpinClick} disabled={mustSpin}>
//               Quay
//             </Button>
//             {result && <p>You won: {result}</p>}
//           </>
//         )}

//         <LowerSection>
//           <LogContainer>
//             <LogTitle>Lịch Sử Quay</LogTitle>
//             {spinLogs && spinLogs.length > 0 ? (
//               spinLogs.map((log, index) => (
//                 <LogItem key={index}>
//                   <strong>{log.username}</strong> quay trúng{" "}
//                   <strong>{log.prize_category}</strong> ({log.prize_name}) (
//                   {log.formattedTime})
//                 </LogItem>
//               ))
//             ) : (
//               <p>No spin logs available.</p>
//             )}
//           </LogContainer>
//           <CboxGeneral />
//         </LowerSection>
//       </Container>
//     </Layout>
//   );
// };

// export default VongQuayMayManPage;

// async function getVatPhamId(prizeName) {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       throw new Error("Token not found in local storage");
//     }

//     const response = await fetch(
//       `/api/user/game/vong-quay/vat-pham?name=${encodeURIComponent(prizeName)}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const data = await response.json();

//     if (response.ok && data && data.ID) {
//       return data.ID;
//     } else {
//       console.error(
//         "Error fetching vat_pham ID:",
//         data.message || "Invalid response"
//       );
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching vat_pham ID:", error);
//     return null;
//   }
// }

