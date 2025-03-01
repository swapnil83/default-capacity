export interface ServiceTerritory {
    id: number;
    territory: string;
};

export interface Market {
    id: number;
    market: string;
    serviceTerritories: ServiceTerritory[];
};

export interface State {
    id: number;
    state: string;
    markets: Market[];
};

export interface Locations {
    locations: State[];
};

export interface DateCalendarization {
    id: number;
    value: string;
    startDate?: string | null;
    endDate?: string | null;
};

export interface Calendarization {
    calendarization: DateCalendarization[];
};

export interface LocationsApiResponseData {
    status: string;
    data: Locations;
    errorMessage?: string;
};

export interface CalendarizationApiResponseData {
    status: string;
    data: Calendarization;
    errorMessage?: string;
};

export interface LocationsState {
    status: 'idle' | 'success' | 'failure' | string;
    states: State[];
    errorMessage: string;
    isLoading: boolean;
};

export interface CalendarizationState {
    status: 'idle' | 'success' | 'failure' | string;
    calendarization: DateCalendarization[];
    errorMessage: string;
    isLoading: boolean;
};

export interface DefaultCapacityFilterState {
    selectedState: string;
    selectedMarket: string;
    selectedTerritory: string;
    selectedCalendarization: string;
    startDate: Date | null;
    endDate: Date | null;
};