import { DefaultCapacityTableData } from "../components/capacity/DefaultCapacityTable/DefaultCapacityTable.types";

export const capacitySlotsAppointmentFreezeData: DefaultCapacityTableData = {
    capacitySlots: [
        { id: 1, category: "Territory Level", day: { mon: 75, tue: 75, wed: 75, thu: 75, fri: 75, sat: 40, sun: 0 }, isDisabled: true },
        { id: 2, category: "FBR (IN)", day: { mon: 60, tue: 60, wed: 60, thu: 60, fri: 60, sat: 35, sun: 0 }, isDisabled: false },
        { id: 3, category: "FBR (AP)", day: { mon: 10, tue: 10, wed: 10, thu: 10, fri: 10, sat: 5, sun: 0 }, isDisabled: false },
        { id: 4, category: "FBR (SC)", day: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 }, isDisabled: false },
        { id: 5, category: "CPR (IN)", day: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 }, isDisabled: false },
        { id: 6, category: "CPR (AP)", day: { mon: 5, tue: 5, wed: 5, thu: 5, fri: 5, sat: 0, sun: 0 }, isDisabled: false },
        { id: 7, category: "MDU", day: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 }, isDisabled: false },
        { id: 8, category: "Escalations", day: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 }, isDisabled: false },
    ],
    appointmentFreeze: [
        { id: 1, product: "FBR (IN)", startTime: "8:00", endTime: "10:00", day: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false }, isDisabled: false },
        { id: 2, product: "FBR (IN)", startTime: "10:00", endTime: "12:00", day: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }, isDisabled: false },
        { id: 3, product: "FBR (IN)", startTime: "1:00", endTime: "3:00", day: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false }, isDisabled: false },
        { id: 4, product: "FBR (IN)", startTime: "3:00", endTime: "5:00", day: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: true }, isDisabled: false },
        { id: 5, product: "FBR (IN)", startTime: "5:00", endTime: "7:00", day: { mon: false, tue: false, wed: true, thu: false, fri: false, sat: true, sun: true }, isDisabled: false },
        { id: 6, product: "FBR (RP)", startTime: "8:00", endTime: "10:00", day: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false }, isDisabled: false },
        { id: 7, product: "FBR (RP)", startTime: "10:00", endTime: "12:00", day: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false }, isDisabled: false },
        { id: 8, product: "FBR (RP)", startTime: "1:00", endTime: "3:00", day: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false }, isDisabled: false },
        { id: 9, product: "FBR (RP)", startTime: "3:00", endTime: "5:00", day: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: true }, isDisabled: false },
        { id: 10, product: "FBR (RP)", startTime: "5:00", endTime: "7:00", day: { mon: false, tue: false, wed: true, thu: false, fri: true, sat: true, sun: true }, isDisabled: false },
    ]
};