const { checkToken, reduceToken } = require("../../helper/common");
const { pick, groupBy } = require("lodash");
const { getToken } = require("../../config/manageToken");
const Assistant = require("../../model/assistanceModel");
const sequelize = require("../../db/connection");

exports.getAssistantsV2 = async (req, res) => {
    try {
        // Query 1: Get all active assistants
        let [assistants] = await sequelize.query(`
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
                position,
                FALSE AS isTool,
                type,
                character_category
            FROM assistant
            WHERE isActive = 1 AND type = 'assistant'
            ORDER BY id ASC;
        `);

        // --- REORDERING LOGIC FOR EXACT POSITIONING (Assistants) ---
        let positioned = assistants.filter(a => a.position !== null).sort((a, b) => a.position - b.position);
        let unpositioned = assistants.filter(a => a.position === null);
        let finalAssistants = new Array(assistants.length).fill(null);

        positioned.forEach(item => {
            const index = item.position - 1;
            if (index >= 0 && index < finalAssistants.length && finalAssistants[index] === null) {
                finalAssistants[index] = item;
            } else {
                unpositioned.push(item); 
            }
        });

        let unposIdx = 0;
        for (let i = 0; i < finalAssistants.length; i++) {
            if (finalAssistants[i] === null) {
                finalAssistants[i] = unpositioned[unposIdx];
                unposIdx++;
            }
        }
        assistants = finalAssistants.filter(a => a !== null);

        // Query 2: Get all active tools
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

        // Query 3: Get categories with positioning
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
        const allCategories = finalCategories.filter(c => c !== null).map(c => c.name);
        
        const assistantCategories = allCategories.filter(cat => assistants.some(a => a.category === cat));
        const toolCategories = allCategories.filter(cat => tools.some(t => t.category === cat));

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
        let [characters] = await sequelize.query(`
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
                position,
                FALSE AS isTool,
                type,
                character_category
            FROM assistant
            WHERE isActive = 1 AND type = 'character'
            ORDER BY id ASC;
        `);

        // --- REORDERING LOGIC FOR EXACT POSITIONING (Characters) ---
        let positioned = characters.filter(a => a.position !== null).sort((a, b) => a.position - b.position);
        let unpositioned = characters.filter(a => a.position === null);
        let finalCharacters = new Array(characters.length).fill(null);

        positioned.forEach(item => {
            const index = item.position - 1;
            if (index >= 0 && index < finalCharacters.length && finalCharacters[index] === null) {
                finalCharacters[index] = item;
            } else {
                unpositioned.push(item); 
            }
        });

        let unposIdx = 0;
        for (let i = 0; i < finalCharacters.length; i++) {
            if (finalCharacters[i] === null) {
                finalCharacters[i] = unpositioned[unposIdx];
                unposIdx++;
            }
        }
        characters = finalCharacters.filter(a => a !== null);

        // Query 2: Get categories with positioning
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
        const allCategories = finalCategories.filter(c => c !== null).map(c => c.name);
        const characterCategories = allCategories.filter(cat => characters.some(a => a.category === cat));

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
