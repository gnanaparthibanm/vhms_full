import React from 'react';
import { Skeleton } from './skeleton';

export const TableSkeleton = ({ rowCount = 10, columnCount = 5 }) => {
    return (
        <>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-[var(--border-color)]">
                    {Array.from({ length: columnCount }).map((_, colIndex) => (
                        <td key={colIndex} className="p-4">
                            <Skeleton className="h-6 w-full bg-red-50 dark:bg-red-900/10 rounded-md animate-pulse" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
};
