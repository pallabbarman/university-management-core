"use strict";
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncForEach = void 0;
const asyncForEach = async (array, callback) => {
    if (!Array.isArray(array)) {
        throw new Error('Expected an array');
    }
    for (let index = 0; index < array.length; index += 1) {
        await callback(array[index], index, array);
    }
};
exports.asyncForEach = asyncForEach;
