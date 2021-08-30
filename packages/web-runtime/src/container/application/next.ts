import Vue from 'vue'
import { RuntimeApi } from '../types'

export abstract class NextApplication {
  protected readonly runtimeApi: RuntimeApi

  protected constructor(runtimeApi: RuntimeApi) {
    this.runtimeApi = runtimeApi
  }

  abstract register(): Promise<void>

  abstract prepare(): Promise<void>

  abstract mounted(instance: Vue): Promise<void>
}
