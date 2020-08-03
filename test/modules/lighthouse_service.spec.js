import axios from 'axios'
import * as Modules from '@/modules/lighthouse_service'
import config from '@/nuxt.config'

describe('lighthouse_service api', () => {
  describe('#createPlatesFromBarcodes ', () => {
    let mock, plateBarcodes, response

    beforeEach(() => {
      mock = jest.spyOn(axios, 'post')
    })

    afterEach(() => {
      mock.mockRestore()
    })

    it('for a single barcode on failure', async () => {
      plateBarcodes = ['aBarcode1']

      response = {
        errors: ['foreign barcode is already in use.']
      }

      mock.mockResolvedValue(response)

      const result = await Modules.createPlatesFromBarcodes({
        plateBarcodes
      })

      expect(result).toEqual([{...response, success: false}])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[0] }
      )
    })

    it('for a single barcode on success', async () => {
      plateBarcodes = ['aBarcode1']

      response = {
        data: {
          plate_barcode: 'aBarcode1',
          centre: 'tst1',
          number_of_positives: 3
        }
      }

      mock.mockResolvedValue(response)

      const result = await Modules.createPlatesFromBarcodes({
        plateBarcodes
      })

      expect(result).toEqual([{ ...response.data, success: true}])
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[0] }
      )
    })

    it('#for multiple barcodes on failure', async () => {
      plateBarcodes = ['aBarcode1', 'aBarcode2']

      const response1 = {
        errors: ['foreign barcode is already in use.']
      }

      const response2 = {
        errors: ['No samples for this barcode']
      }

      mock.mockImplementationOnce(() => response1)
      mock.mockImplementationOnce(() => response2)

      const result = await Modules.createPlatesFromBarcodes({
        plateBarcodes
      })

      expect(result).toEqual([{...response1, success: false}, {...response2, success: false}])
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[0] }
      )
      expect(mock).toHaveBeenNthCalledWith(
        2,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[1] }
      )
    })

    it('#for multiple barcodes on success', async () => {
      plateBarcodes = ['aBarcode1', 'aBarcode2']

      const response1 = {
        data: {
          plate_barcode: 'aBarcode1',
          centre: 'tst1',
          number_of_positives: 3
        }
      }

      const response2 = {
        data: {
          plate_barcode: 'aBarcode2',
          centre: 'tst1',
          number_of_positives: 2
        }
      }

      mock.mockImplementationOnce(() => response1)
      mock.mockImplementationOnce(() => response2)

      const result = await Modules.createPlatesFromBarcodes({
        plateBarcodes
      })

      expect(result).toEqual([{...response1.data, success: true}, {...response2.data, success: true}])
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[0] }
      )
      expect(mock).toHaveBeenNthCalledWith(
        2,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[1] }
      )
    })

    it('#for multiple barcodes on partial success/ failure', async () => {
      plateBarcodes = ['aBarcode1', 'aBarcode2']

      const response1 = {
        errors: ['No samples for this barcode']
      }

      const response2 = {
        data: {
          plate_barcode: 'aBarcode2',
          centre: 'tst1',
          number_of_positives: 2
        }
      }

      mock.mockImplementationOnce(() => response1)
      mock.mockImplementationOnce(() => response2)

      const result = await Modules.createPlatesFromBarcodes({
        plateBarcodes
      })

      expect(result).toEqual([{...response1, success: false}, {...response2.data, success: true}])
      expect(mock).toHaveBeenCalledTimes(2)
      expect(mock).toHaveBeenNthCalledWith(
        1,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[0] }
      )
      expect(mock).toHaveBeenNthCalledWith(
        2,
        `${config.privateRuntimeConfig.lighthouseBaseURL}/plates/new`,
        { barcode: plateBarcodes[1] }
      )
    })
  })

  describe('#getImports', () => {
    let mock, response, expected

    beforeEach(() => {
      mock = jest.spyOn(axios, 'get')
    })

    afterEach(() => {
      mock.mockRestore()
    })

    it('returns data successfully', async () => {
      expected = { data: { items: [] } }
      mock.mockResolvedValue(expected)
      response = await Modules.getImports()
      expect(response.data).toEqual(expected.data)
    })

    it('when there is an error', async () => {
      mock.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      response = await Modules.getImports()
      expect(response.error).toEqual(new Error('There was an error'))
    })
  })
})
