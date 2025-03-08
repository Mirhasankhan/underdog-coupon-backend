"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getRandomItems = (array, numItems) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numItems);
};
exports.default = getRandomItems;
