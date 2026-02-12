import { RefObject, UIEventHandler, useEffect, useMemo, useState } from "react";

interface UseVirtualListParams<T, E> {
  allItems: T[];
  rowHeightPx: number;
  itemsPerRow: number;
  buffer?: number;
  outerContainerRef: RefObject<E | null>;
}

export default function useVirtualList<
  T,
  E extends HTMLElement = HTMLDivElement,
>({
  itemsPerRow,
  allItems,
  rowHeightPx,
  outerContainerRef,
  buffer = 5,
}: UseVirtualListParams<T, E>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const handleOuterContainerScroll: UIEventHandler<E> = (e) => {
    e.preventDefault();
    setScrollTop(e.currentTarget.scrollTop);
  };

  useEffect(() => {
    if (!outerContainerRef.current) return;

    setContainerHeight(outerContainerRef.current.clientHeight);
    setContainerWidth(outerContainerRef.current.clientWidth);
  }, [
    outerContainerRef,
    outerContainerRef.current?.clientHeight,
    outerContainerRef.current?.clientWidth,
  ]);

  const { visibleRows, slidingWindowTranslatePx, innerContainerHeight } =
    useMemo<{
      visibleRows: T[][];
      slidingWindowTranslatePx: number;
      innerContainerHeight: number;
    }>(() => {
      if (
        !containerHeight ||
        allItems.length === 0 ||
        !containerWidth ||
        itemsPerRow < 1
      ) {
        return {
          visibleRows: [],
          slidingWindowTranslatePx: 0,
          innerContainerHeight: 0,
        };
      }

      const totalRows = Math.ceil(allItems.length / itemsPerRow);
      const innerContainerHeight = totalRows * rowHeightPx;

      const newStartIndex = Math.floor(scrollTop / rowHeightPx);
      const visibleRowCount = Math.ceil(containerHeight / rowHeightPx);

      const startRowIndex = Math.max(0, newStartIndex - buffer);
      const endRowIndex = Math.min(
        totalRows,
        newStartIndex + visibleRowCount + buffer,
      );

      const startItemIndex = startRowIndex * itemsPerRow;
      const endItemIndex = endRowIndex * itemsPerRow;

      const slicedItems = allItems.slice(startItemIndex, endItemIndex);

      const groupedRows: T[][] = [];
      for (let i = 0; i < slicedItems.length; i += itemsPerRow) {
        groupedRows.push(slicedItems.slice(i, i + itemsPerRow));
      }

      return {
        visibleRows: groupedRows,
        slidingWindowTranslatePx: newStartIndex * rowHeightPx,
        innerContainerHeight,
      };
    }, [
      containerHeight,
      allItems,
      containerWidth,
      itemsPerRow,
      rowHeightPx,
      scrollTop,
      buffer,
    ]);

  return {
    handleOuterContainerScroll,
    visibleRows,
    slidingWindowTranslatePx,
    innerContainerHeight,
  };
}
