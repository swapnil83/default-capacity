import React from 'react';
import { MaterialReactTable, MRT_Cell, MRT_ColumnDef } from 'material-react-table';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { AppointmentFreezeRowData, DefaultCapacityTableState } from '../DefaultCapacityTable/DefaultCapacityTable.types';

type AppointmentSlotsProps = {
    appointmentFreezeData: AppointmentFreezeRowData[];
    defaultCapacityTableState: DefaultCapacityTableState;
    updateDefaultCapacityTableState: (newState: Partial<DefaultCapacityTableState>) => void;
    startDate: Date | null;
    endDate: Date | null;
};

const AppointmentSlots: React.FC<AppointmentSlotsProps> = ({ appointmentFreezeData, defaultCapacityTableState, updateDefaultCapacityTableState, startDate, endDate }) => {
    console.log('AppointmentSlots');
    const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    const getDayToKeyMap: { [key: number]: string } = {
        0: 'sun',
        1: 'mon',
        2: 'tue',
        3: 'wed',
        4: 'thu',
        5: 'fri',
        6: 'sat',
    };

    const getDaysInRange = (start: Date, end: Date): string[] => {
        const days: string[] = [];
        const currentDate = new Date(start);
        while (currentDate <= end) {
            const dayOfWeek = getDayToKeyMap[currentDate.getDay()];
            if (!days.includes(dayOfWeek)) {
                days.push(dayOfWeek);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return days;
    };

    const enabledDays: string[] = startDate && endDate ? getDaysInRange(startDate, endDate) : daysOfWeek;

    const handleCellValueChange = (rowIndex: number, columnId: string, value: boolean) => {
        const newData = [...appointmentFreezeData];
        newData[rowIndex] = { ...newData[rowIndex], day: { ...newData[rowIndex].day, [columnId]: value } };

        updateDefaultCapacityTableState({
            data: {
                capacitySlots: defaultCapacityTableState.data.capacitySlots,
                appointmentFreeze: newData
            }
        });
    };

    const columns: MRT_ColumnDef<AppointmentFreezeRowData>[] = [
        {
            accessorKey: 'product',
            header: 'Product',
            enableEditing: false,
            size: 80,
            Cell: ({ cell }: { cell: MRT_Cell<AppointmentFreezeRowData> }) => {
                const value = cell.getValue<string>();
                return (
                    <div style={{
                        padding: '8px 16px',
                    }}>
                        {value}
                    </div>
                );
            },
        },
        {
            accessorKey: 'startTime',
            header: 'Start Time',
            enableEditing: false,
            size: 50,
            Cell: ({ cell }: { cell: MRT_Cell<AppointmentFreezeRowData> }) => {
                const value = cell.getValue<string>();
                return (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                        color: 'gray',
                        backgroundColor: 'lightgray',
                        padding: 0,
                        borderRight: '1px solid rgba(224, 224, 224, 1)',
                    }}>
                        {value}
                    </div>
                );
            },
        },
        {
            accessorKey: 'endTime',
            header: 'End Time',
            enableEditing: false,
            size: 50,
            Cell: ({ cell }: { cell: MRT_Cell<AppointmentFreezeRowData> }) => {
                const value = cell.getValue<string>();
                return (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                        color: 'gray',
                        backgroundColor: 'lightgray',
                        padding: 0,
                        borderRight: '1px solid rgba(224, 224, 224, 1)',
                    }}>
                        {value}
                    </div>
                );
            },
        },
        ...daysOfWeek.map((day) => ({
            accessorKey: `day.${day}`,
            header: day.charAt(0).toUpperCase() + day.slice(1),
            enableEditing: (row: { original: AppointmentFreezeRowData }) => !row.original.isDisabled && enabledDays.includes(day),
            size: 50,
            Cell: ({ cell }: { cell: MRT_Cell<AppointmentFreezeRowData> }) => {
                const value = cell.row.original.day[day as keyof typeof cell.row.original.day];
                const isDisabled = cell.row.original.isDisabled || !enabledDays.includes(day);

                return (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            width: '100%',
                            backgroundColor: isDisabled ? 'lightgray' : value ? '#ffffff' : 'transparent',
                            padding: 0,
                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                        }}
                        onClick={() => {
                            if (!isDisabled) {
                                handleCellValueChange(cell.row.index, day, !value);
                            }
                        }}
                    >
                        {value ? null : <CancelIcon style={{ color: 'red' }} />}
                    </div>
                );
            },
        })),
    ];

    return (
        <>
            <MaterialReactTable
                columns={columns}
                data={appointmentFreezeData}
                enableRowActions={false}
                enableEditing
                enableColumnActions={false}
                enableColumnFilters={false}
                enablePagination={false}
                enableSorting={false}
                enableBottomToolbar={false}
                enableTopToolbar={false}
                editDisplayMode="cell"
                muiTableBodyCellProps={{
                    sx: {
                        padding: 0,
                        borderRight: '1px solid rgba(224, 224, 224, 1)',
                        '&:last-child': {
                            borderRight: 'none',
                        },
                        height: '48px',
                    }
                }}
                muiTableHeadCellProps={{
                    sx: {
                        borderRight: '1px solid rgba(224, 224, 224, 1)',
                        '&:last-child': {
                            borderRight: 'none'
                        },
                        backgroundColor: '#ffcc00',
                        padding: '8px 16px',
                    }
                }}
                muiTableBodyRowProps={{
                    sx: {
                        '&:last-child td': {
                            borderBottom: 'none',
                        }
                    }
                }}
            />
        </>
    );
};

export default AppointmentSlots;