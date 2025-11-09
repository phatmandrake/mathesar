import { get } from 'svelte/store';
import { _ } from 'svelte-i18n';

import { iconLockClosed, iconLockOpen } from '@mathesar/icons';
import { getColumnMetadataValue } from '@mathesar/api/rpc/columns';
import type { ProcessedColumn, TabularData } from '@mathesar/stores/table-data';
import { buttonMenuEntry } from '@mathesar-component-library';

export function* toggleReadOnly(p: {
  column: ProcessedColumn;
  tabularData: TabularData;
}) {
  const canModifyReadOnly = get(
    p.tabularData.table.currentAccess.currentRoleOwns,
  );
  if (!canModifyReadOnly) return;

  const currentReadOnly = getColumnMetadataValue(p.column.column, 'readonly');

  yield buttonMenuEntry({
    icon: currentReadOnly ? iconLockOpen : iconLockClosed,
    label: currentReadOnly
      ? get(_)('Make Column Editable')
      : get(_)('Make Column Read-Only'),
    onClick: async () => {
      await p.tabularData.columnsDataStore.setDisplayOptions(p.column.column, {
        readonly: !currentReadOnly,
      });
      await p.tabularData.columnsDataStore.fetch();
    },
  });
}
