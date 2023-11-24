import { useUserStore } from '@/store/modules/user'
import { useSettingsStore } from '@/store/modules/settings'
import { useTalkStore } from '@/store/modules/talk'
import { useEditorStore } from '@/store/modules/editor'
import { useDialogueStore } from '@/store/modules/dialogue'
import { useEditorDraftStore } from '@/store/modules/editor-draft'
import { useUploadsStore } from '@/store/modules/uploads'
import { useNoteStore } from '@/store/modules/note'

export {
  useUserStore,
  useSettingsStore,
  useEditorStore,
  useDialogueStore,
  useEditorDraftStore,
  useUploadsStore,
  useTalkStore,
  useNoteStore
}
