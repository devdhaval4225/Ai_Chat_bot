const { checkToken, reduceToken } = require("../../helper/common");
const { pick, groupBy } = require("lodash");
const { getToken } = require("../../config/manageToken");
const Assistant = require("../../model/assistanceModel");
const sequelize = require("../../db/connection");

exports.getAssistantsV2 = async (req, res) => {
    try {
        // Step 1: Get and sort categories FIRST
        let [catRows] = await sequelize.query(`
            SELECT name, position FROM categories WHERE isActive = 1 ORDER BY id ASC;
        `);

        // Sort categories by their position
        let catPositioned = catRows.filter(c => c.position !== null).sort((a, b) => a.position - b.position);
        let catUnpositioned = catRows.filter(c => c.position === null);
        let finalCategories = new Array(catRows.length).fill(null);

        catPositioned.forEach(item => {
            const index = item.position - 1;
            if (index >= 0 && index < finalCategories.length && finalCategories[index] === null) {
                finalCategories[index] = item;
            } else {
                catUnpositioned.push(item);
            }
        });

        let catIdx = 0;
        for (let i = 0; i < finalCategories.length; i++) {
            if (finalCategories[i] === null) {
                finalCategories[i] = catUnpositioned[catIdx];
                catIdx++;
            }
        }
        const sortedCategoryNames = finalCategories.filter(c => c !== null).map(c => c.name);

        // Step 2: Get all assistants
        let [assistants] = await sequelize.query(`
            SELECT 
                id,
                hashId COLLATE utf8mb4_unicode_ci AS hashId,
                nameAssistant COLLATE utf8mb4_unicode_ci AS nameAssistant,
                category COLLATE utf8mb4_unicode_ci AS category,
                imageUrl COLLATE utf8mb4_unicode_ci AS imageUrl,
                thumbnail COLLATE utf8mb4_unicode_ci AS thumbnail,
                tier COLLATE utf8mb4_unicode_ci AS tier,
                isLatestFeatures,
                isMostFavorite,
                isActive,
                isHomeScreen,
                position,
                FALSE AS isTool,
                type,
                character_category
            FROM assistant
            WHERE isActive = 1 AND type = 'assistant'
            ORDER BY id ASC;
        `);

        // Step 3: Group by category and apply exact positioning within each category
        let groupedByCategory = groupBy(assistants, 'category');
        let finalAssistants = [];

        sortedCategoryNames.forEach(catName => {
            let catItems = groupedByCategory[catName] || [];
            if (catItems.length > 0) {
                // Separate positioned and unpositioned items
                let positioned = catItems.filter(a => a.position !== null);
                let unpositioned = catItems.filter(a => a.position === null);

                // Create array with exact positions
                let maxPos = positioned.length > 0 ? Math.max(...positioned.map(a => a.position)) : 0;
                let finalCatArray = new Array(Math.max(maxPos, catItems.length)).fill(null);

                // Place positioned items at exact spots

                positioned.forEach(item => {
                    const idx = item.position - 1;
                    if (idx >= 0 && idx < finalCatArray.length) {
                        finalCatArray[idx] = item;
                    }
                });

                // Fill remaining spots with unpositioned items

                let unposIdx = 0;
                for (let i = 0; i < finalCatArray.length; i++) {
                    if (finalCatArray[i] === null && unposIdx < unpositioned.length) {
                        finalCatArray[i] = unpositioned[unposIdx];
                        unposIdx++;
                    }
                }
                // Add any remaining unpositioned items
                while (unposIdx < unpositioned.length) {
                    finalCatArray.push(unpositioned[unposIdx]);
                    unposIdx++;
                }

                finalAssistants = finalAssistants.concat(finalCatArray.filter(a => a !== null));
            }
        });

        assistants = finalAssistants;

        // Query: Get all active tools
        const [tools] = await sequelize.query(`
            SELECT 
                id,
                hashId COLLATE utf8mb4_unicode_ci AS hashId,
                nameAssistant COLLATE utf8mb4_unicode_ci AS nameAssistant,
                category COLLATE utf8mb4_unicode_ci AS category,
                imageUrl COLLATE utf8mb4_unicode_ci AS imageUrl,
                tier COLLATE utf8mb4_unicode_ci AS tier,
                isLatestFeatures,
                isMostFavorite,
                isActive,
                isHomeScreen,
                NULL AS position,
                TRUE AS isTool,
                'assistant' AS type,
                'default' AS character_category
            FROM aiTool
            WHERE isActive = 1
            ORDER BY category ASC, id ASC;
        `);

        const assistantCategories = sortedCategoryNames.filter(cat => assistants.some(a => a.category === cat));
        const toolCategories = sortedCategoryNames.filter(cat => tools.some(t => t.category === cat));

        res.status(200).json({
            assistantCategories: assistantCategories,
            toolCategories: toolCategories,
            assistants: assistants,
            aiTools: tools
        })
    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({ message: "Something went wrong", status: 500 })
    }
};

exports.getCharactersV2 = async (req, res) => {
    try {
        // Step 1: Get and sort categories FIRST
        let [catRows] = await sequelize.query(`
            SELECT name, position FROM categories WHERE isActive = 1 ORDER BY id ASC;
        `);

        // Sort categories by their position
        let catPositioned = catRows.filter(c => c.position !== null).sort((a, b) => a.position - b.position);
        let catUnpositioned = catRows.filter(c => c.position === null);
        let finalCategories = new Array(catRows.length).fill(null);

        catPositioned.forEach(item => {
            const index = item.position - 1;
            if (index >= 0 && index < finalCategories.length && finalCategories[index] === null) {
                finalCategories[index] = item;
            } else {
                catUnpositioned.push(item);
            }
        });

        let catIdx = 0;
        for (let i = 0; i < finalCategories.length; i++) {
            if (finalCategories[i] === null) {
                finalCategories[i] = catUnpositioned[catIdx];
                catIdx++;
            }
        }
        const sortedCategoryNames = finalCategories.filter(c => c !== null).map(c => c.name);

        // Step 2: Get all characters
        let [characters] = await sequelize.query(`
            SELECT 
                id,
                hashId COLLATE utf8mb4_unicode_ci AS hashId,
                nameAssistant COLLATE utf8mb4_unicode_ci AS nameAssistant,
                category COLLATE utf8mb4_unicode_ci AS category,
                imageUrl COLLATE utf8mb4_unicode_ci AS imageUrl,
                thumbnail COLLATE utf8mb4_unicode_ci AS thumbnail,
                tier COLLATE utf8mb4_unicode_ci AS tier,
                isLatestFeatures,
                isMostFavorite,
                isActive,
                isHomeScreen,
                position,
                FALSE AS isTool,
                type,
                character_category
            FROM assistant
            WHERE isActive = 1 AND type = 'character'
            ORDER BY id ASC;
        `);

        // Step 3: Group by category and apply exact positioning within each category
        let groupedByCategory = groupBy(characters, 'category');
        let finalCharacters = [];

        sortedCategoryNames.forEach(catName => {
            let catItems = groupedByCategory[catName] || [];
            if (catItems.length > 0) {
                // Separate positioned and unpositioned items
                let positioned = catItems.filter(a => a.position !== null);
                let unpositioned = catItems.filter(a => a.position === null);

                // Create array with exact positions
                let maxPos = positioned.length > 0 ? Math.max(...positioned.map(a => a.position)) : 0;
                let finalCatArray = new Array(Math.max(maxPos, catItems.length)).fill(null);

                // Place positioned items at exact spots

                positioned.forEach(item => {
                    const idx = item.position - 1;
                    if (idx >= 0 && idx < finalCatArray.length) {
                        finalCatArray[idx] = item;
                    }
                });

                // Fill remaining spots with unpositioned items

                let unposIdx = 0;
                for (let i = 0; i < finalCatArray.length; i++) {
                    if (finalCatArray[i] === null && unposIdx < unpositioned.length) {
                        finalCatArray[i] = unpositioned[unposIdx];
                        unposIdx++;
                    }
                }
                // Add any remaining unpositioned items
                while (unposIdx < unpositioned.length) {
                    finalCatArray.push(unpositioned[unposIdx]);
                    unposIdx++;
                }

                finalCharacters = finalCharacters.concat(finalCatArray.filter(a => a !== null));
            }
        });

        characters = finalCharacters;

        const characterCategories = sortedCategoryNames.filter(cat => characters.some(a => a.category === cat));

        res.status(200).json({
            characterCategories: characterCategories,
            characters: characters
        })
    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({ message: "Something went wrong", status: 500 })
    }
};

exports.getAssistantCategories = async (req, res) => {
    try {
        let [catRows] = await sequelize.query(`
            SELECT name, position FROM categories WHERE isActive = 1 ORDER BY id ASC;
        `);

        // --- REORDERING LOGIC FOR EXACT POSITIONING (Categories) ---
        let catPositioned = catRows.filter(c => c.position !== null).sort((a, b) => a.position - b.position);
        let catUnpositioned = catRows.filter(c => c.position === null);
        let finalCategories = new Array(catRows.length).fill(null);

        catPositioned.forEach(item => {
            const index = item.position - 1;
            if (index >= 0 && index < finalCategories.length && finalCategories[index] === null) {
                finalCategories[index] = item;
            } else {
                catUnpositioned.push(item);
            }
        });

        let catIdx = 0;
        for (let i = 0; i < finalCategories.length; i++) {
            if (finalCategories[i] === null) {
                finalCategories[i] = catUnpositioned[catIdx];
                catIdx++;
            }
        }
        const sorted = finalCategories.filter(c => c !== null).map(c => c.name);

        res.status(200).json({
            data: sorted
        })
    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({ message: "Something went wrong", status: 500 })
    }
};

exports.getCharacterCategories = async (req, res) => {
    try {
        let [catRows] = await sequelize.query(`
            SELECT name, position FROM categories WHERE isActive = 1 ORDER BY id ASC;
        `);

        // --- REORDERING LOGIC FOR EXACT POSITIONING (Categories) ---
        let catPositioned = catRows.filter(c => c.position !== null).sort((a, b) => a.position - b.position);
        let catUnpositioned = catRows.filter(c => c.position === null);
        let finalCategories = new Array(catRows.length).fill(null);

        catPositioned.forEach(item => {
            const index = item.position - 1;
            if (index >= 0 && index < finalCategories.length && finalCategories[index] === null) {
                finalCategories[index] = item;
            } else {
                catUnpositioned.push(item);
            }
        });

        let catIdx = 0;
        for (let i = 0; i < finalCategories.length; i++) {
            if (finalCategories[i] === null) {
                finalCategories[i] = catUnpositioned[catIdx];
                catIdx++;
            }
        }
        const sorted = finalCategories.filter(c => c !== null).map(c => c.name);

        res.status(200).json({
            data: sorted
        })
    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({ message: "Something went wrong", status: 500 })
    }
};
