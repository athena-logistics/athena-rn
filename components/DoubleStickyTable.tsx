import { RefreshControl, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Cell, Table, TableWrapper } from 'react-native-reanimated-table';
import colors from '../constants/colors';
import { useOrientation } from '../hooks/useOrientation';
import useSyncedScrollViews from '../hooks/useSyncedScrollViews';

export type CellType = Omit<
  React.ComponentProps<typeof Cell>,
  'width' | 'height' | 'flex'
>;

export type DynamicCellType = CellType | ((opts: CellOpts) => CellType);

export interface CellOpts {
  transposed: boolean;
}

export default function DoubleStickyTable({
  table,
  heightArr,
  transposedHeightArr,
  widthArr,
  transposedWidthArr,
  ...rest
}: Omit<React.ComponentProps<typeof DoubleStickyTableBase>, 'table'> & {
  table: DynamicCellType[][];
  transposedHeightArr: number[];
  transposedWidthArr: number[];
}) {
  const totalWidth = widthArr.reduce((a, b) => a + b, 0);
  const totalHeight = heightArr.reduce((a, b) => a + b, 0);

  const { isPortrait } = useOrientation();

  if (
    (totalWidth > totalHeight && isPortrait) ||
    (totalWidth < totalHeight && !isPortrait)
  ) {
    return (
      <DoubleStickyTableBase
        table={mapCells(transpose(table), (cell) => {
          if (typeof cell === 'function') return cell({ transposed: true });
          return cell;
        })}
        heightArr={transposedHeightArr}
        widthArr={transposedWidthArr}
        {...rest}
      />
    );
  }

  return (
    <DoubleStickyTableBase
      table={mapCells(table, (cell) => {
        if (typeof cell === 'function') return cell({ transposed: false });
        return cell;
      })}
      heightArr={heightArr}
      widthArr={widthArr}
      {...rest}
    />
  );
}

function DoubleStickyTableBase({
  table,
  heightArr,
  widthArr,
  refreshing,
  onRefresh,
}: {
  table: CellType[][];
  heightArr: number[];
  widthArr: number[];
  refreshing: React.ComponentProps<typeof RefreshControl>['refreshing'];
  onRefresh: React.ComponentProps<typeof RefreshControl>['onRefresh'];
}) {
  const { topRowHeader, lowerRowHeaders, columnHeaders, columnContent } =
    sliceTable(table);

  const [headerHeight, ...contentHeight] = heightArr;
  const [headerWidth, ...contentWidth] = widthArr;

  const { LeaderScrollView, FollowerScrollView } = useSyncedScrollViews({
    horizontal: true,
  });

  return (
    <ScrollView
      stickyHeaderIndices={[0]}
      style={styles.table}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.rowSeparator}>
        <View style={{ flexDirection: 'row' }}>
          <Table style={styles.columnSeparator}>
            <Cell width={headerWidth} height={headerHeight} {...topRowHeader} />
          </Table>
          <FollowerScrollView>
            <Table>
              <TableWrapper style={{ flexDirection: 'row' }}>
                {columnHeaders.map((columnHeader, index) => (
                  <Cell
                    key={index}
                    {...columnHeader}
                    width={contentWidth[index]}
                    height={headerHeight}
                  />
                ))}
              </TableWrapper>
            </Table>
          </FollowerScrollView>
        </View>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Table style={styles.columnSeparator}>
          {lowerRowHeaders.map((rowHeader, index) => (
            <TableWrapper key={index}>
              <Cell
                width={headerWidth}
                height={contentHeight[index]}
                {...rowHeader}
              />
            </TableWrapper>
          ))}
        </Table>
        <LeaderScrollView style={styles.rowSeparator}>
          <Table>
            {columnContent.map((contentRow, rowIndex) => (
              <TableWrapper key={rowIndex} style={{ flexDirection: 'row' }}>
                {contentRow.map((contentCell, columnIndex) => (
                  <Cell
                    key={columnIndex}
                    {...contentCell}
                    width={contentWidth[columnIndex]}
                    height={contentHeight[rowIndex]}
                  />
                ))}
              </TableWrapper>
            ))}
          </Table>
        </LeaderScrollView>
      </View>
    </ScrollView>
  );
}

function extractTableRowHeaders<T>(table: T[][]): {
  headers: T[];
  content: T[][];
} {
  return {
    headers: table.map(([rowHeader]) => rowHeader),
    content: table.map(([, ...content]) => content),
  };
}

function sliceTable<T>(table: T[][]) {
  const { headers: rowHeaders, content: rowContent } =
    extractTableRowHeaders(table);
  const [topRowHeader, ...lowerRowHeaders] = rowHeaders;
  const [columnHeaders, ...columnContent] = rowContent;

  return {
    topRowHeader,
    lowerRowHeaders,
    columnHeaders,
    columnContent,
  };
}

function mapCells<A, B>(
  table: A[][],
  mapper: (cell: A, index: number) => B,
): B[][] {
  return table.map((row) => row.map((cell, index) => mapper(cell, index)));
}

function transpose<T>(data: T[][]): T[][] {
  return data[0].map((_, i) => data.map((row) => row[i]));
}

const styles = StyleSheet.create({
  table: {
    backgroundColor: colors.white,
  },
  columnSeparator: {
    borderColor: colors.primary,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  rowSeparator: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
