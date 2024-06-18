

<!-- Counter.vue -->
<template>
    <div>
        <button @click="increment">Incrementar</button>
        <span>{{ count }}</span>
    </div>
</template>
  
<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
    props: {
        counterStore: Object
    },
    setup(props) {
        const count = computed(() => props.counterStore.count)

        const increment = () => {
            props.counterStore.increment()
        }

        return {
            count,
            increment
        }
    }
})
</script>
  
