export type CapacitySlotsRowData = {
    id: number;
    category: string;
    day: {
        mon: number;
        tue: number;
        wed: number;
        thu: number;
        fri: number;
        sat: number;
        sun: number;
    };
    isDisabled: boolean;
};

export interface AppointmentFreezeRowData {
    id: number;
    product: string;
    startTime: string;
    endTime: string;
    day: {
        mon: boolean;
        tue: boolean;
        wed: boolean;
        thu: boolean;
        fri: boolean;
        sat: boolean;
        sun: boolean;
    };
    isDisabled: boolean;
};

export interface DefaultCapacityTableData {
    capacitySlots: CapacitySlotsRowData[];
    appointmentFreeze: AppointmentFreezeRowData[];
};

export interface DefaultCapacityTableApiResponseData {
    status: string;
    data: DefaultCapacityTableData;
    errorMessage?: string;
};

export interface DefaultCapacityTableState {
    status: 'idle' | 'success' | 'failure' | string;
    data: DefaultCapacityTableData;
    errorMessage: string;
    isLoading: boolean;
};