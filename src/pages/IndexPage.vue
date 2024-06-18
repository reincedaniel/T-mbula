
<!-- MyPage.vue -->
<template>
    <div>
        <template v-for="i in 2" :key="i">
            <counter :counter-store="createCounterStore()" />
        </template>
    </div>
</template>
  
<script>
import { defineComponent } from 'vue'
import { createCounterStore } from 'src/stores/store'
import Counter from 'src/components/TestComponent.vue'

export default defineComponent({
    components: {
        Counter
    },
    methods: {
        createCounterStore() {
            return createCounterStore()
        }
    }
})
</script>
  