// Lighthouse Service Module
// Accepts a list of plateBarcodes in the moduleOptions
// Send a POST request to the Lighthouse service API
// To create each plate
// Return list of responses

import axios from 'axios'
import config from '@/nuxt.config'

const handlePromise = async (promise) => {
  let rawResponse
  try {
    rawResponse = await promise

    if (rawResponse.errors) {
      return { success: false , ...rawResponse }
    } else {
      return { success: true , ...rawResponse.data }
    }
  } catch (resp) {
    return { success: false, ...resp.response.data }
  }
}

const createPlatesFromBarcodes = async (moduleOptions) => {
  const plateBarcodes = moduleOptions.plateBarcodes

  const promises = plateBarcodes.map((barcode) => {
    const url = `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`
    return axios.post(url, { barcode })
  })

  const responses = await Promise.all(
    promises.map((promise) => handlePromise(promise))
  )
  return responses
}

export { createPlatesFromBarcodes }
