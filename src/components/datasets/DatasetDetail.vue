<template>
  <section>
    <h1 class="title">{{ title | upperFirst }}</h1>
    <MovProjectPicker :disabled="editMode" />
    <div v-if="editMode && !dataset">
      <p>{{ $t('dataset.invalid') }}</p>
    </div>
    <div v-else-if="dataset" class="has-background-white is-fluid">
      <div class="has-padding">
        <div class="is-flex">
          <b-field class="is-flex-grow-1 mr-2" label="Name">
            <b-input v-model="dataset.name" expanded />
          </b-field>
          <b-field class="is-flex-grow-1" label="Type">
            <b-select placeholder="Select type" expanded v-model="dataset.type">
              <option v-for="type in datasetTypes" :key="type.uuid" :value="type.name">
                {{ type.name }}
              </option>
            </b-select>
          </b-field>
        </div>
        <div class="is-flex mb-4">
          <b-field label="Status">
            <b-input v-model="dataset.status" disabled></b-input>
          </b-field>
        </div>
        <!-- drag and drop file upload -->
        <template v-if="editMode && hasData">
          <b-button class="mr-2" icon-left="download" type="is-primary" @click="onDownload">
            Download data
          </b-button>
          <b-button icon-left="trash" type="is-danger" @click="onDeleteInitData">
            Delete data
          </b-button>
        </template>
        <template v-else-if="canUpload">
          <label class="label">File upload</label>
          <div class="mb-3 is-flex is-align-items-center is-flex-direction-column">
            <b-upload class="is-flex" v-model="file" drag-drop>
              <section class="section">
                <div class="content has-text-centered">
                  <span>
                    <b-icon icon="upload" size="is-medium" type="is-primary"></b-icon>
                  </span>
                  <span>
                    {{
                      hasFile ? 'Choose a different file' : 'Drop your file here or click to upload'
                    }}
                  </span>
                </div>
              </section>
            </b-upload>
          </div>
          <b-field grouped>
            <b-input v-if="hasFile" :value="file.name" disabled expanded></b-input>
            <b-button v-if="hasFile" class="is-white" :disabled="uploading" @click="file = null">
              <b-icon icon="times-circle" type="is-danger" />
            </b-button>
          </b-field>
        </template>
        <progress
          v-if="uploading"
          class="progress is-primary"
          :value="uploadProgress"
          max="100"
        ></progress>
        <div class="is-clearfix"></div>
        <div class="is-pulled-right">
          <b-button class="mr-2" :disabled="uploading" @click="goBack">
            {{ $t('actions.cancel') }}
          </b-button>
          <b-button type="is-primary" :disabled="uploading" @click="onSave">
            {{ $t('actions.save') }}
          </b-button>
        </div>
        <div class="is-clearfix"></div>
        <div v-if="map">
          <img :src="map" />
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { successMessage } from '@/snackbar';
import DatasetSchemaStore from '@/store/modules/DatasetSchemaStore';
import DatasetsStore from '@/store/modules/DatasetsStore';
import { UUID, Dataset } from '@/types';

@Component({ name: 'DatasetDetail' })
export default class DatasetDetail extends Vue {
  @Prop({ type: String }) uuid!: UUID;
  file: File | null = null;
  map = '';
  dataset: Dataset | null = null;
  saving = false;

  get uploadProgress() {
    return DatasetsStore.progress;
  }

  get datasetTypes() {
    return DatasetSchemaStore.datasetTypes.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });
  }

  get addMode() {
    return !this.uuid;
  }

  get editMode() {
    return !!this.uuid;
  }

  get hasFile() {
    return !!this.file;
  }

  get hasData() {
    let status = this.dataset?.status.toLowerCase();
    return status === 'accepted' || status === 'done';
  }

  get canUpload() {
    return this.addMode || this.dataset?.status === 'Empty' || this.dataset?.status === 'Failed';
  }

  get uploading() {
    return this.saving && this.hasFile;
  }

  get title() {
    return this.addMode ? this.$t('dataset.addNew') : this.$t('dataset.edit');
  }

  goBack() {
    this.$router.push({ name: 'Datasets' });
  }

  onSave() {
    this.saving = true;
    if (this.addMode) {
      this.addNewDataset();
    } else {
      this.updateDataset();
    }
  }

  getMap() {
    DatasetsStore.getMap(this.uuid).then(data => {
      this.map = data;
    });
  }

  async onDownload() {
    if (this.dataset) {
      await DatasetsStore.downloadInitData(this.dataset);
    }
  }

  onDeleteInitData() {
    this.confirmDelete();
  }

  confirmDelete() {
    this.$buefy.dialog.confirm({
      message:
        'Are you sure you want to <b>delete</b> this init data? This action cannot be undone.',
      title: 'Delete Init Data',
      confirmText: 'Delete Init Data',
      type: 'is-danger',
      hasIcon: true,
      onConfirm: () => this.deleteInitData()
    });
  }

  deleteInitData() {
    DatasetsStore.deleteInitData(this.uuid).then(() => {
      this.getThisDatasetInEditMode();
    });
  }

  goToEdit(uuid: string) {
    this.saving = false;
    this.$router.push({
      name: 'DatasetEdit',
      params: { uuid: uuid }
    });
  }

  async addNewDataset() {
    if (this.dataset) {
      const response = await DatasetsStore.addDataset(this.dataset);
      if (response) {
        if (this.file) {
          await DatasetsStore.uploadInitData({
            uuid: response.dataset_uuid,
            file: this.file
          });
        }

        this.resetSavingStatus();
        successMessage('Successfully created Dataset');
        this.goToEdit(response.dataset_uuid);
      }
    }
  }

  async updateDataset() {
    if (this.dataset) {
      const response = await DatasetsStore.updateDataset(this.dataset);
      if (response && this.file) {
        DatasetsStore.uploadInitData({
          uuid: this.uuid,
          file: this.file
        });
      }

      successMessage('Successfully updated Dataset');
      this.getThisDatasetInEditMode();
      this.resetSavingStatus();
    }
  }

  async getThisDataset() {
    this.dataset = await DatasetsStore.getDataset(this.uuid);
    this.getMap();
  }

  @Watch('uuid', { immediate: true })
  getThisDatasetInEditMode() {
    if (this.editMode) {
      this.getThisDataset();
    }
  }

  async getDatasetTypes() {
    await DatasetSchemaStore.getDatasetTypes();
  }

  resetSavingStatus() {
    this.saving = false;
    this.file = null;
  }

  async mounted() {
    await this.getDatasetTypes();
    if (this.addMode) {
      this.dataset = {
        uuid: '',
        name: '',
        display_name: '',
        type: '',
        status: '',
        has_data: false
      };
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep {
  .upload {
    min-width: 350px;
    .upload-draggable {
      width: 100%;
    }
  }
}
</style>
