"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTimeConflict = void 0;
const hasTimeConflict = (existingSlots, newSlot) => {
    for (const slot of existingSlots) {
        const existingStart = new Date(`1970-01-01T${slot.startTime}:00`);
        const existingEnd = new Date(`1970-01-01T${slot.endTime}:00`);
        const newStart = new Date(`1970-01-01T${newSlot.startTime}:00`);
        const newEnd = new Date(`1970-01-01T${newSlot.endTime}:00`);
        if (newStart < existingEnd && newEnd > existingStart) {
            return true;
        }
    }
    return false;
};
exports.hasTimeConflict = hasTimeConflict;
