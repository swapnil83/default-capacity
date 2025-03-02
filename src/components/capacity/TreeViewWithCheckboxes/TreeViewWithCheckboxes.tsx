import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { Typography, Box, Checkbox } from '@mui/material';

import { Market, ServiceTerritory, State } from '../DefaultCapacityFilter/DefaultCapacityFilter.types';
import { isNodeIndeterminate } from '../BulkTerritoriesSelection/BulkTerritoriesSelection';

interface TreeViewWithCheckboxesProps {
    selected: Set<number>;
    onSelect: (id: number, checked: boolean) => void;
    locationsData: State[];
}

const TreeViewWithCheckboxes: React.FC<TreeViewWithCheckboxesProps> = ({ selected, onSelect, locationsData }) => {
    const isNodeSelected = (id: number) => selected.has(id);

    const renderTree = (nodes: State | Market | ServiceTerritory) => {
        const isSelected = isNodeSelected(nodes.id);
        const isIndeterminate = isNodeIndeterminate(nodes, selected);

        const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            onSelect(nodes.id, event.target.checked);
        };

        return (
            <TreeItem
                key={nodes.id}
                itemId={nodes.id.toString()}
                label={
                    <Box display="flex" alignItems="center">
                        <Checkbox
                            checked={isSelected}
                            indeterminate={isIndeterminate}
                            onChange={handleCheckboxChange}
                        />
                        <Typography>{'state' in nodes ? nodes.state : 'market' in nodes ? nodes.market : nodes.territory}</Typography>
                    </Box>
                }
            >
                {'markets' in nodes && nodes.markets.map((node) => renderTree(node))}
                {'serviceTerritories' in nodes && nodes.serviceTerritories.map((node) => renderTree(node))}
            </TreeItem>
        );
    };

    return <SimpleTreeView>{locationsData.map((node) => renderTree(node))}</SimpleTreeView>;
};

export default TreeViewWithCheckboxes;