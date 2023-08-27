/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */

export const asyncForEach = async (array: any[], callback: any) => {
    if (!Array.isArray(array)) {
        throw new Error('Expected an array');
    }
    for (let index = 0; index < array.length; index += 1) {
        await callback(array[index], index, array);
    }
};
