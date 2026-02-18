import { RefObject, UIEventHandler, useEffect, useMemo, useState } from "react";

/**
 * @description 가상 리스트를 구현하기 위한 파라미터 객체입니다.
 * @template T 렌더링할 아이템의 타입
 * @template E 스크롤 컨테이너로 사용될 HTML 요소의 타입
 */
interface UseVirtualListParams<T, E> {
  /** 전체 아이템 리스트 */
  allItems: T[];
  /** 각 행의 높이 (px) */
  rowHeightPx: number;
  /** 한 행에 들어가는 아이템의 개수 */
  itemsPerRow: number;
  /** 화면에 보이는 영역 외에 추가로 렌더링할 행의 개수. 빠른 스크롤 시 깜빡임을 방지합니다. (기본값: 5) */
  buffer?: number;
  /** 스크롤이 발생하는 외부 컨테이너의 Ref 객체 */
  outerContainerRef: RefObject<E | null>;
}

/**
 * @description 가상 리스트를 구현하기 위한 커스텀 훅입니다.
 * 대규모 데이터 리스트를 렌더링할 때, 현재 보이는 부분만 렌더링하여 성능을 최적화합니다.
 *
 * @template T 렌더링할 아이템의 타입
 * @template E 스크롤 컨테이너로 사용될 HTML 요소의 타입 (기본값: HTMLDivElement)
 *
 * @param {UseVirtualListParams<T, E>} params - 가상 리스트 설정을 위한 파라미터 객체
 * @returns {object} 가상 리스트를 구현하는 데 필요한 값과 함수들을 담은 객체
 * @property {UIEventHandler<E>} handleOuterContainerScroll - 외부 컨테이너의 onScroll 이벤트에 연결할 핸들러 함수입니다.
 * @property {T[][]} visibleRows - 현재 화면에 보여져야 할 아이템들의 2차원 배열입니다. 각 내부 배열은 한 행(row)을 나타냅니다.
 * @property {number} slidingWindowTranslatePx - `visibleRows`를 담고 있는 슬라이딩 윈도우 컨테이너에 적용할 `transform: translateY()` 값 (px) 입니다.
 * @property {number} innerContainerHeight - 모든 아이템이 렌더링되었을 때의 내부 컨테이너의 총 높이 (px) 입니다. 스크롤바를 올바르게 표시하기 위해 사용됩니다.
 *
 * @example
 * // 사용 예시:
 * const MyComponent = () => {
 *   const allItems = Array.from({ length: 1000 }, (_, i) => `아이템 ${i + 1}`);
 *   const outerContainerRef = useRef<HTMLDivElement>(null);
 *
 *   const {
 *     handleOuterContainerScroll,
 *     visibleRows,
 *     slidingWindowTranslatePx,
 *     innerContainerHeight,
 *   } = useVirtualList({
 *     allItems,
 *     rowHeightPx: 50,
 *     itemsPerRow: 3,
 *     outerContainerRef,
 *   });
 *
 *   return (
 *     <div
 *       ref={outerContainerRef}
 *       onScroll={handleOuterContainerScroll}
 *       style={{ height: '500px', overflow: 'auto' }}
 *     >
 *       <div style={{ height: `${innerContainerHeight}px`, position: 'relative' }}>
 *         <div style={{ transform: `translateY(${slidingWindowTranslatePx}px)` }}>
 *           {visibleRows.map((row, rowIndex) => (
 *             <div key={rowIndex} style={{ display: 'flex', height: '50px' }}>
 *               {row.map(item => (
 *                 <div key={item} style={{ flex: 1 }}>{item}</div>
 *               ))}
 *             </div>
 *           ))}
 *         </div>
 *       </div>
 *     </div>
 *   );
 * };
 */
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
    setScrollTop(e.currentTarget.scrollTop);
  };

  useEffect(() => {
    const container = outerContainerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      setContainerHeight(container.clientHeight);
      setContainerWidth(container.clientWidth);
    };

    // Set initial dimensions
    updateDimensions();

    // Observe container for resize events
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    // Cleanup observer on unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, [outerContainerRef]);

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
