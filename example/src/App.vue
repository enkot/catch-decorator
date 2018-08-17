<template>
    <div>
        <p>Message count: {{ messageCount }}</p>
        <small v-if="errorMessage" style="color: red;">{{ errorMessage }}</small>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import api from './fakeApi'
import { Catch } from '../../src/index'

@Component
export default class Hello extends Vue {
    private messageCount: number = 0
    private errorMessage: string = ''

    private created() {
        this.getMessage()
    }

    @Catch('handleError')
    private async getMessage() {
        await api.getData()

        this.messageCount++
    }

    private handleError(e: any) {
        this.errorMessage = `${e.name}: Oopps, ${e.message}`
    }
}
</script>