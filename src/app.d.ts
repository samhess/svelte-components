import type {GenericObject} from '$lib/types.ts'

// for information about these interfaces
// See https://kit.svelte.dev/docs/types#app
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      session: GenericObject | null
      user: GenericObject | null
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {}
