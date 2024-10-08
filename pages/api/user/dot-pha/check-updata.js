import db from '@/lib/db';
import jwt from 'jsonwebtoken';
import {
    levelItemChances,
    consistentItemChances,
} from "@/utils/levelItemChances";
import { giftItems } from '@/utils/giftItems';

var successChance = 0;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const { usedItemIds } = req.body;

        // Check user level and experience
        const userQuery = 'SELECT * FROM users WHERE id = ?';
        const userResult = await dbQuery(userQuery, [userId]);
        if (userResult.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { exp: currentExp, level: currentLevel, tai_san: currentTaisan } = userResult[0];
        const cap = Math.floor((currentLevel - 1) / 10) + 1;

        const levelQuery = 'SELECT * FROM levels WHERE cap_so = ?';
        const levelResult = await dbQuery(levelQuery, [currentLevel]);
        if (levelResult.length === 0) {
            return res.status(500).json({ message: 'Level data not found' });
        }

        const { exp, dot_pha_that_bai_mat_exp_percent: dotPhaThatBai, bac_nhan_duoc_khi_dot_pha: newTaisan, vatpham_bat_buoc: vatphambatbuoc } = levelResult[0];
        const requiredItemIds = vatphambatbuoc
            ? vatphambatbuoc.split(",")
            : [];
        const itemIds = requiredItemIds.join(",")
        if (itemIds.trim() !== '') {

            const itemIdArray = itemIds.split(',').map(id => {
                const parsedId = parseInt(id.trim(), 10);
                return isNaN(parsedId) ? null : parsedId;
            }).filter(id => id !== null);

            // Check if user has all required items
            const checkItemsQuery = `
            SELECT vat_pham_id, so_luong FROM ruong_do 
            WHERE user_id = ? AND vat_pham_id IN (?) AND so_luong > 0
        `;
            const itemsResult = await dbQuery(checkItemsQuery, [userId, itemIdArray]);

            const userHasAllItems = itemIdArray.every(id =>
                itemsResult.some(item => item.vat_pham_id === id && item.so_luong > 0)
            );
            if (!userHasAllItems) {
                return res.status(200).json({ message: "Bạn không có đủ vật phẩm bắt buộc để Đột Phá." });
            }
        }
        if (currentExp < exp) {
            return res.status(200).json({ message: 'Tu vi đạo hữu còn quá non, vui lòng tu luyện thêm.' });
        }

        successChance = levelResult[0].ty_le_dot_pha_thanh_cong;

        if (usedItemIds) {
            const usedItemIdArray = usedItemIds.split(',').map(id => parseInt(id.trim(), 10));
            for (const item of usedItemIdArray) {
                const levelRangeKey = findLevelByItemId(item);
                let itemChance = 0;
                let reductionPercentage = (Math.max(0, cap - levelRangeKey) / 10) * 100;
                if (levelRangeKey == 0) reductionPercentage = 0;

                if (levelRangeKey !== null && levelItemChances[levelRangeKey]?.includes(item)) {
                    itemChance = consistentItemChances[item] * ((100 - reductionPercentage) / 100);
                } else {
                    itemChance = consistentItemChances[item];
                }

                itemChance = Math.round(itemChance);
                if (itemChance > 0) {
                    successChance += itemChance;
                }
            }

            // Decrement the quantity of each item by 1
            for (const itemId of usedItemIdArray) {
                const updateQuery = `
                    UPDATE ruong_do 
                    SET so_luong = CASE 
                        WHEN so_luong > 1 THEN so_luong - 1
                        ELSE 0
                      END
                    WHERE user_id = ? AND vat_pham_id = ?
                `;
                await dbQuery(updateQuery, [userId, itemId]);
            }
        }

        // Decrement the quantity of each mandatory item by 1
        if (itemIds) {
            const ItemIdBatBuoc = itemIds.split(',').map(id => parseInt(id.trim(), 10));
            for (const itemId of ItemIdBatBuoc) {
                const updateQuery = `
                    UPDATE ruong_do 
                    SET so_luong = CASE 
                        WHEN so_luong > 1 THEN so_luong - 1
                        ELSE 0
                      END
                    WHERE user_id = ? AND vat_pham_id = ?
                `;
                await dbQuery(updateQuery, [userId, itemId]);
            }
        }
        console.log(`Account ${userId} tổng % đột phá là ${successChance}`);
        // Random success check
        const randomValue = Math.round(Math.random() * 100);
        if (randomValue <= successChance) {
            const leftoverExp = 0;
            const newLevel = currentLevel + 1;
            const newsTaiSan = currentTaisan + newTaisan;
            const availableItems = giftItems[cap];
            const randomItemId = availableItems[Math.floor(Math.random() * availableItems.length)];

            await dbQuery(
                'UPDATE users SET level = ?, exp = ?, tai_san = ? WHERE id = ?',
                [newLevel, leftoverExp, newsTaiSan, userId]
            );

            const itemResult = await dbQuery(
                'SELECT Name FROM vat_pham WHERE ID = ?',
                [randomItemId]
            );

            const queryCheck = `
                SELECT id, so_luong FROM ruong_do WHERE user_id = ? AND vat_pham_id = ?
            `;
            const checkResults = await dbQuery(queryCheck, [userId, randomItemId]);

            let newQuantity;
            if (checkResults.length > 0) {
                const existingItem = checkResults[0];
                newQuantity = existingItem.so_luong + 1;
                await dbQuery(
                    'UPDATE ruong_do SET so_luong = ? WHERE id = ?',
                    [newQuantity, existingItem.id]
                );
            } else {
                await dbQuery(
                    'INSERT INTO ruong_do (user_id, vat_pham_id, so_luong) VALUES (?, ?, 1)',
                    [userId, randomItemId]
                );
                newQuantity = 1;
            }

            return res.status(200).json({
                message: 'Đột phá thành công',
                nextLevel: getTuvi(newLevel),
                item: itemResult[0],
                newTaiSan: newTaisan,
                so_luong: newQuantity,
            });
        } else {
            let expLoss = Math.floor(exp * (dotPhaThatBai / 100));
            const newExp = currentExp - expLoss;

            await dbQuery(
                'UPDATE users SET exp = ? WHERE id = ?',
                [newExp, userId]
            );

            return res.status(200).json({
                message: 'Rất tiếc, đạo hữu chưa đủ may mắn để có thể tiến cấp, vui lòng tu luyện thêm!',
                nextLevel: getTuvi(currentLevel + 1),
                successChance: successChance,
                expLoss: expLoss,
            });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
}

const getTuvi = (capSo) => {
    const tuVis = {
        0: 'Phàm Nhân',
        1: 'Luyện Khí Tầng 1',
        2: 'Luyện Khí Tầng 2',
        3: 'Luyện Khí Tầng 3',
        4: 'Luyện Khí Tầng 4',
        5: 'Luyện Khí Tầng 5',
        6: 'Luyện Khí Tầng 6',
        7: 'Luyện Khí Tầng 7',
        8: 'Luyện Khí Tầng 8',
        9: 'Luyện Khí Tầng 9',
        10: 'Luyện Khí Viên Mãn',
        11: 'Trúc Cơ Tầng 1',
        12: 'Trúc Cơ Tầng 2',
        13: 'Trúc Cơ Tầng 3',
        14: 'Trúc Cơ Tầng 4',
        15: 'Trúc Cơ Tầng 5',
        16: 'Trúc Cơ Tầng 6',
        17: 'Trúc Cơ Tầng 7',
        18: 'Trúc Cơ Tầng 8',
        19: 'Trúc Cơ Tầng 9',
        20: 'Trúc Cơ Viên Mãn',
        21: 'Kim Đan Tầng 1',
        22: 'Kim Đan Tầng 2',
        23: 'Kim Đan Tầng 3',
        24: 'Kim Đan Tầng 4',
        25: 'Kim Đan Tầng 5',
        26: 'Kim Đan Tầng 6',
        27: 'Kim Đan Tầng 7',
        28: 'Kim Đan Tầng 8',
        29: 'Kim Đan Tầng 9',
        30: 'Kim Đan Viên Mãn',
        31: 'Nguyên Anh Tầng 1',
        32: 'Nguyên Anh Tầng 2',
        33: 'Nguyên Anh Tầng 3',
        34: 'Nguyên Anh Tầng 4',
        35: 'Nguyên Anh Tầng 5',
        36: 'Nguyên Anh Tầng 6',
        37: 'Nguyên Anh Tầng 7',
        38: 'Nguyên Anh Tầng 8',
        39: 'Nguyên Anh Tầng 9',
        40: 'Nguyên Anh Viên Mãn',
        41: 'Hóa Thần Tầng 1',
        42: 'Hóa Thần Tầng 2',
        43: 'Hóa Thần Tầng 3',
        44: 'Hóa Thần Tầng 4',
        45: 'Hóa Thần Tầng 5',
        46: 'Hóa Thần Tầng 6',
        47: 'Hóa Thần Tầng 7',
        48: 'Hóa Thần Tầng 8',
        49: 'Hóa Thần Tầng 9',
        50: 'Hóa Thần Viên Mãn',
        51: 'Luyện Hư Tầng 1',
        52: 'Luyện Hư Tầng 2',
        53: 'Luyện Hư Tầng 3',
        54: 'Luyện Hư Tầng 4',
        55: 'Luyện Hư Tầng 5',
        56: 'Luyện Hư Tầng 6',
        57: 'Luyện Hư Tầng 7',
        58: 'Luyện Hư Tầng 8',
        59: 'Luyện Hư Tầng 9',
        60: 'Luyện Hư Viên Mãn',
        61: 'Hợp Thể Tầng 1',
        62: 'Hợp Thể Tầng 2',
        63: 'Hợp Thể Tầng 3',
        64: 'Hợp Thể Tầng 4',
        65: 'Hợp Thể Tầng 5',
        66: 'Hợp Thể Tầng 6',
        67: 'Hợp Thể Tầng 7',
        68: 'Hợp Thể Tầng 8',
        69: 'Hợp Thể Tầng 9',
        70: 'Hợp Thể Viên Mãn',
        71: 'Đại Thừa Tầng 1',
        72: 'Đại Thừa Tầng 2',
        73: 'Đại Thừa Tầng 3',
        74: 'Đại Thừa Tầng 4',
        75: 'Đại Thừa Tầng 5',
        76: 'Đại Thừa Tầng 6',
        77: 'Đại Thừa Tầng 7',
        78: 'Đại Thừa Tầng 8',
        79: 'Đại Thừa Tầng 9',
        80: 'Đại Thừa Viên Mãn',
        81: 'Độ Kiếp Tầng 1',
        82: 'Độ Kiếp Tầng 2',
        83: 'Độ Kiếp Tầng 3',
        84: 'Độ Kiếp Tầng 4',
        85: 'Độ Kiếp Tầng 5',
        86: 'Độ Kiếp Tầng 6',
        87: 'Độ Kiếp Tầng 7',
        88: 'Độ Kiếp Tầng 8',
        89: 'Độ Kiếp Tầng 9',
        90: 'Độ Kiếp Viên Mãn',
        91: 'Nhân Tiên Tầng 1',
        92: 'Nhân Tiên Tầng 2',
        93: 'Nhân Tiên Tầng 3',
        94: 'Nhân Tiên Tầng 4',
        95: 'Nhân Tiên Tầng 5',
        96: 'Nhân Tiên Tầng 6',
        97: 'Nhân Tiên Tầng 7',
        98: 'Nhân Tiên Tầng 8',
        99: 'Nhân Tiên Tầng 9',
        100: 'Nhân Tiên Viên Mãn',
        101: 'Địa Tiên Tầng 1',
        102: 'Địa Tiên Tầng 2',
        103: 'Địa Tiên Tầng 3',
        104: 'Địa Tiên Tầng 4',
        105: 'Địa Tiên Tầng 5',
        106: 'Địa Tiên Tầng 6',
        107: 'Địa Tiên Tầng 7',
        108: 'Địa Tiên Tầng 8',
        109: 'Địa Tiên Tầng 9',
        110: 'Địa Tiên Viên Mãn',
        111: 'Thiên Tiên Tầng 1',
        112: 'Thiên Tiên Tầng 2',
        113: 'Thiên Tiên Tầng 3',
        114: 'Thiên Tiên Tầng 4',
        115: 'Thiên Tiên Tầng 5',
        116: 'Thiên Tiên Tầng 6',
        117: 'Thiên Tiên Tầng 7',
        118: 'Thiên Tiên Tầng 8',
        119: 'Thiên Tiên Tầng 9',
        120: 'Thiên Tiên Viên Mãn',
        121: 'Thượng Tiên Tầng 1',
        122: 'Thượng Tiên Tầng 2',
        123: 'Thượng Tiên Tầng 3',
        124: 'Thượng Tiên Tầng 4',
        125: 'Thượng Tiên Tầng 5',
        126: 'Thượng Tiên Tầng 6',
        127: 'Thượng Tiên Tầng 7',
        128: 'Thượng Tiên Tầng 8',
        129: 'Thượng Tiên Tầng 9',
        130: 'Thượng Tiên Viên Mãn',
        131: 'Đại La Tiên Tầng 1',
        132: 'Đại La Tiên Tầng 2',
        133: 'Đại La Tiên Tầng 3',
        134: 'Đại La Tiên Tầng 4',
        135: 'Đại La Tiên Tầng 5',
        136: 'Đại La Tiên Tầng 6',
        137: 'Đại La Tiên Tầng 7',
        138: 'Đại La Tiên Tầng 8',
        139: 'Đại La Tiên Tầng 9',
        140: 'Đại La Tiên Viên Mãn',
        999: 'Thiên Đạo'
    };
    return tuVis[capSo];
};

const findLevelByItemId = (itemId) => {
    for (const levelRangeKey in levelItemChances) {
        if (levelItemChances[levelRangeKey].includes(itemId)) {
            return levelRangeKey;
        }
    }
    return null;
};

const dbQuery = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (error, results) => {
            if (error) reject(error);
            resolve(results);
        });
    });
};
