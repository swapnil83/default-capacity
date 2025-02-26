import React from 'react';
import { MaterialReactTable, MRT_Cell, MRT_ColumnDef } from 'material-react-table';
import { CapacitySlotsRowData, DefaultCapacityTableState } from '../DefaultCapacityTable/DefaultCapacityTable.types';

type CapacitySlotsProps = {
    capacitySlotsData: CapacitySlotsRowData[];
    defaultCapacityTableState: DefaultCapacityTableState;
    updateDefaultCapacityTableState: (newState: Partial<DefaultCapacityTableState>) => void;
    startDate: Date | null;
    endDate: Date | null;
};

const CapacitySlots: React.FC<CapacitySlotsProps> = ({ capacitySlotsData, defaultCapacityTableState, updateDefaultCapacityTableState, startDate, endDate }) => {
    console.log('CapacitySlots');
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

    const handleCellValueChange = (rowIndex: number, columnId: string, value: string) => {
        const newData = [...capacitySlotsData];
        const numericValue = parseFloat(value);

        if (!isNaN(numericValue)) {
            const roundedValue = Math.round(numericValue * 100) / 100;
            newData[rowIndex] = {
                ...newData[rowIndex],
                day: { ...newData[rowIndex].day, [columnId]: roundedValue },
            };

            // Update the "Territory Level" row sum for the edited column
            if (columnId !== 'category') {
                const territoryRow = newData.find((row) => row.category === "Territory Level");
                if (territoryRow) {
                    const sum = newData
                        .filter((row) => !row.isDisabled)
                        .reduce((acc, row) => acc + row.day[columnId as keyof typeof row.day], 0);
                    const roundedValue = Math.round(sum * 100) / 100;
                    territoryRow.day[columnId as keyof typeof territoryRow.day] = roundedValue;
                }
            }

            updateDefaultCapacityTableState({
                data: {
                    appointmentFreeze: defaultCapacityTableState.data.appointmentFreeze,
                    capacitySlots: newData
                }
            });
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>, cell: MRT_Cell<CapacitySlotsRowData>, day: string) => {
        const inputElement = e.currentTarget as HTMLInputElement;

        if (isNaN(Number(inputElement.value)) || inputElement.value === '') {
            // Revert to previous value if the input is not a number or is empty
            inputElement.value = String(cell.row.original.day[day as keyof typeof cell.row.original.day]);
        }

        handleCellValueChange(cell.row.index, day, inputElement.value);
    };

    const validateInput = (value: string): boolean => {
        // Check if the value contains only numbers
        return /^\d*\.?\d*$/.test(value);
    };

    const columns: MRT_ColumnDef<CapacitySlotsRowData>[] = [
        {
            accessorKey: 'category',
            header: 'Category',
            enableEditing: false, // Category column is not editable
            size: 80,
            Cell: ({ cell }: { cell: MRT_Cell<CapacitySlotsRowData> }) => {
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
        ...daysOfWeek.map((day) => ({
            accessorKey: `day.${day}`,
            header: day.charAt(0).toUpperCase() + day.slice(1),
            enableEditing: (row: { original: CapacitySlotsRowData }) => !row.original.isDisabled && enabledDays.includes(day),
            size: 50,
            Cell: ({ cell }: { cell: MRT_Cell<CapacitySlotsRowData> }) => {
                const value = cell.row.original.day[day as keyof typeof cell.row.original.day];
                const isDisabled = cell.row.original.isDisabled || !enabledDays.includes(day);

                return (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                        backgroundColor: isDisabled ? 'lightgray' : 'transparent',
                        padding: 0,
                        borderRight: '1px solid rgba(224, 224, 224, 1)',
                    }}>
                        {value}
                    </div>
                );
            },
            muiEditTextFieldProps: ({ cell }: { cell: MRT_Cell<CapacitySlotsRowData> }) => ({
                type: 'text',
                inputProps: {
                    min: 0,
                    style: { padding: '8px 16px' },
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                        // Check if the input is valid
                        const isValid = validateInput(e.target.value);
                        // Apply styles based on validity
                        e.target.style.border = isValid ? '1px solid #ccc' : '2px solid red';
                        e.target.style.fontWeight = isValid ? 'normal' : 'bold';
                        e.target.style.color = isValid ? 'black' : 'red';
                    }
                },
                onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                    handleBlur(e, cell, day);
                },
                onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                        handleCellValueChange(cell.row.index, day, e.currentTarget.value);
                    }
                },
                sx: {
                    '& .MuiInputBase-root': {
                        padding: '0 !important',
                    }
                }
            }),
        })),
    ];

    return (
        <>
            <MaterialReactTable
                columns={columns}
                data={capacitySlotsData}
                enableRowActions={false} // Disable row actions column
                enableEditing // Enable cell-level editing
                enableColumnActions={false}
                enableColumnFilters={false}
                enablePagination={false}
                enableSorting={false}
                enableBottomToolbar={false}
                enableTopToolbar={false}
                editDisplayMode="cell"
                muiTableBodyCellProps={
                    () => ({
                        onClick: (e) => {
                            e.stopPropagation();
                            const cellElement = e.currentTarget as HTMLElement;
                            cellElement.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
                        },
                        sx: {
                            padding: 0,
                            borderRight: '1px solid rgba(224, 224, 224, 1)',
                            '&:last-child': {
                                borderRight: 'none',
                            },
                            height: '48px',
                        }
                    })
                }
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
                muiTableBodyRowProps={({ row }) => ({
                    sx: {
                        backgroundColor: row.original.category === 'Territory Level' ? 'lightgray' : 'transparent',
                        '&:last-child td': {
                            borderBottom: 'none',
                        }
                    }
                })}
            />
        </>
    );
};

export default CapacitySlots;