<template>
  <q-page class="q-mx-md">

    <div class="q-pa-md">
      <span class="text-h6 "># Teste PouchDB</span>
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-mt-md">
        <q-input filled v-model="name" label="Nome *" hint="Name and surname" lazy-rules
          :rules="[val => val && val.length > 0 || 'Campo obrigatório']" />

        <q-input filled type="number" v-model="age" label="Idade *" lazy-rules :rules="[
        val => val !== null && val !== '' || 'Campo obrigatório',
        val => val > 0 && val < 100 || 'Valor inválido'
      ]" />

        <q-toggle v-model="accept" label="Eu aceito a licença e os termos" />

        <div>
          <q-btn :label="_id ? 'Alterar' : 'Salvar'" type="submit" :icon="_id ? 'edit' : 'done'"
            :color="_id ? 'orange' : 'primary'" />
          <q-btn label="Restaurar" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </q-form>

    </div>
    <q-separator></q-separator>
    <!-- <pre>{{ allContacts }}</pre> -->
    <div class="q-pa-md ">
      <q-btn outline rounded label="Sincronizar" @click="syncMyDB" icon="sync" color="green" class="q-mb-md q-mr-md" />
      <q-btn rounded v-if="selected.length" label="Apagar" icon="delete" @click="deleteContact" color="red"
        class="q-mb-md  q-mr-md" /> <q-btn rounded v-if="selected.length === 1" label="Alterar" icon="edit"
        @click="editContact" color="orange" class="q-mb-md" />
      <div class="q-gutter-md">
        <q-table class="no-bordered no-shadow  bg-blue-1" title="Treats" :rows="allContacts" :columns="columns"
          row-key="id" selection="multiple" v-model:selected="selected" />
      </div>


    </div>
  </q-page>
</template>

<script>
import { useQuasar, } from 'quasar'
import { ref, onMounted } from 'vue'
import { v4 as uuidv4 } from "uuid";

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Nome',
    align: 'left',
    field: row => row.doc.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'age', align: 'center', label: 'Idade', field: row => row.doc.age, sortable: true },
  { name: 'accept', label: 'Licença e os termos', field: row => row.doc.accept ? 'Aceite' : 'Não Aceite', sortable: true },
]

const rows = [
  {
    name: 'Frozen Yogurt',
    age: 159,
    accept: true,
  },


]
export default {
  setup() {
    const $q = useQuasar()
    const _id = ref(null)
    const _rev = ref(null)
    const name = ref(null)
    const age = ref(null)
    const accept = ref(false)
    const selected = ref([])
    const auth = {
      auth: { username: 'admin', password: '123456789A!!!' }
    }

    // PouchDB e CouchDB

    const _myLocalDB = new PouchDB('isec-contacts')
    const _remoteDB = new PouchDB('http://localhost:5984/isec-contacts', auth)



    const allContacts = ref([])

    const listContacts = () => {
      _myLocalDB.allDocs({ include_docs: true, descending: true })
        .then((docs) => {
          allContacts.value = docs.rows
        })
        .catch(error => {
          $q.notify({
            position: 'bottom',
            progress: true,
            html: true,
            message: `Não foi possível Carregar.`,
            color: 'orange',
            multiLine: true,
            icon: 'warning'
          });
        })
    }

    _myLocalDB.changes({ since: 'now', live: true })
      .on('change', listContacts)

    _myLocalDB.sync(_remoteDB, {
      live: true,
      retry: true
    }).on('change', function (change) {
      $q.notify({
        color: 'pink-5',
        textColor: 'white',
        icon: 'online_prediction',
        position: 'top-right',
        message: 'Replication: change.'
      })
    }).on('paused', function (info) {
      // replication was paused, usually because of a lost connection
      $q.notify({
        color: 'purple-5',
        textColor: 'white',
        icon: 'pause',
        position: 'bottom-right',
        message: 'Replication: Paused.'
      })
    }).on('active', function (info) {
      $q.notify({
        color: 'green-5',
        textColor: 'white',
        icon: 'priority_high',
        position: 'top-left',
        message: 'Replication: Active.'
      })
    }).on('error', function (err) {
      // totally unhandled error (shouldn't happen)
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'priority_high',
        position: 'top-right',
        message: 'Replication: Error.'
      })
    });


    const onReset = () => {
      name.value = null
      age.value = null
      accept.value = false
      _id.value = null
      _rev.value = null
    }


    const onSubmit = () => {

      if (accept.value !== true) {
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Aceite a licença e os termos, por favor!'
        })
      }
      else {
        const objData = { _id: _id.value || new Date().toISOString()/* uuidv4() */, _rev: _rev.value || null, name: name.value, age: age.value, accept: accept.value }
        _myLocalDB.put(objData, (error, result) => {
          if (error) {
            $q.notify({
              color: 'red-5',
              textColor: 'white',
              icon: 'warning',
              message: 'Não foi possível adicionar este contato.'
            })
          } else {
            $q.notify({
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: 'Adicionado com sucesso.'
            })
            onReset()
            //listContacts()
          }
        })

      }
    }

    const deleteContact = () => {
      const objDatas = selected.value.map(contact => {
        return { ...contact.doc, _deleted: true }
      })
      _myLocalDB.bulkDocs(objDatas, (error, result) => {
        if (error) {
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Não foi possível adicionar este contato.'
          })
        } else {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Operação realizada com sucesso.'
          })
          //listContacts()
        }
      })
      selected.value = []
    }

    const editContact = () => {
      const objData = selected.value[0].doc
      name.value = objData.name
      age.value = objData.age
      accept.value = objData.accept
      _id.value = objData._id
      _rev.value = objData._rev
    }

    const syncMyDB = () => {
      _myLocalDB.replicate.to(_remoteDB, { live: true }, syncError) // cá para lá
      _myLocalDB.replicate.from(_remoteDB, { live: true }, syncError) // lá para cá
    }

    const syncError = (event) => {
      console.log("event: ", event)
    }

    onMounted(() => {
      listContacts()
    })
    return {
      name,
      age,
      accept,
      columns,
      rows,
      allContacts,
      onReset,
      _id,
      listContacts,
      onSubmit,
      deleteContact,
      selected,
      editContact,
      syncMyDB
    }
  }
}
</script>
