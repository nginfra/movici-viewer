import { GetGlobalSettings } from '@/api/requests'
import { defaultClient } from '@movici-flow-lib/api/client'
import type { IClient } from '@movici-flow-lib/types'
import { global } from '@/i18n'
import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import { useSettingsStore } from './settings'
import { useSnackbar } from '@movici-flow-lib/baseComposables/useSnackbar'
import { setClient, setProjections } from '@movici-flow-lib/crs'

export const useMainStore = defineStore('main', () => {
  const client: Ref<IClient> = ref(
    defaultClient({
      baseURL: '/',
      callbacks: {
        http(e) {
          failMessage(e.message)
        }
      }
    })
  )
  const initialized = ref(false)
  const settingsStore = useSettingsStore()
  const { failMessage } = useSnackbar()

  async function loadRemoteSettings() {
    const remoteSettings = await client.value.request(new GetGlobalSettings())
    if (!remoteSettings) {
      console.warn('could not load remote settings')
      return
    }
    settingsStore.update(remoteSettings)
  }

  return {
    initialized,
    client,
    async initializeApp() {
      settingsStore.loadLocal()
      await loadRemoteSettings()

      global.locale.value = settingsStore.locale
      client.value.baseURL = settingsStore.baseURL
      setClient(client.value)
      setProjections(settingsStore.projections)

      initialized.value = true
    }
  }
})
