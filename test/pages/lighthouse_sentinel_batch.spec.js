import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import LighthouseSentinelBatch from '@/pages/lighthouse_sentinel_batch'
import * as apiModule from '@/modules/api'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('lighthouse sentinel batch', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(LighthouseSentinelBatch, {
      localVue,
      data() {
        return {
          boxBarcode: 'lw-ogilvie-4',
          items: []
        }
      }
    })
  })

  it('is a Vue instance', () => {
    expect(wrapper.findComponent(LighthouseSentinelBatch).exists()).toBeTruthy()
  })

  it('has a barcode', () => {
    expect(wrapper.vm.boxBarcode).toEqual('lw-ogilvie-4')
  })

  it('has items', () => {
    expect(wrapper.vm.items).toEqual([])
  })

  // TODO: Are these necessary. Would this be better done in an integration test.
  describe('submission', () => {
    let button

    it('has a submit button', () => {
      button = wrapper.find('#handleSentinelSampleCreation')
      expect(button.text()).toEqual('Submit')
    })

    it('on submit button click it calls handleSentinelSampleCreation', () => {
      wrapper.vm.handleSentinelSampleCreation = jest.fn()
      button = wrapper.find('#handleSentinelSampleCreation')
      button.trigger('click')
      expect(wrapper.vm.handleSentinelSampleCreation).toBeCalled()
    })

    it('has a cancel button', () => {
      button = wrapper.find('#cancelSearch')
      expect(button.text()).toEqual('Cancel')
    })

    it('on cancel button click it calls cancelSearch', () => {
      wrapper.vm.cancelSearch = jest.fn()
      button = wrapper.find('#cancelSearch')
      button.trigger('click')
      expect(wrapper.vm.cancelSearch).toBeCalled()
    })
  })

  describe('#handleSentinelSampleCreation', () => {
    it('calls handleApiCall', async () => {
      apiModule.handleApiCall = jest.fn()
      wrapper.vm.handleSentinelSampleCreationResponse = jest.fn()
      await wrapper.vm.handleSentinelSampleCreation()
      expect(apiModule.handleApiCall).toBeCalled()
    })

    it('calls handleApiCall', async () => {
      const expected = [{ it: 'worked' }]
      apiModule.handleApiCall = jest.fn().mockReturnValue(expected)
      wrapper.vm.handleSentinelSampleCreationResponse = jest.fn()
      await wrapper.vm.handleSentinelSampleCreation()
      expect(wrapper.vm.handleSentinelSampleCreationResponse).toBeCalledWith(
        expected
      )
    })
  })

  describe('#handleSentinelSampleCreationResponse', () => {
    let response

    it('on success it populates the table', () => {
      response = [
        {
          data: {
            plate_barcode: 'aBarcode1',
            centre: 'tst1',
            number_of_positives: 3
          }
        },
        {
          data: {
            plate_barcode: 'aBarcode2',
            centre: 'tst1',
            number_of_positives: 1
          }
        }
      ]
      wrapper.vm.handleSentinelSampleCreationResponse(response)
      expect(wrapper.vm.items).toEqual(response.map((r) => r.data))
    })

    it('on failure it shows an error message', () => {
      response = [
        {
          errors: ['an error 1']
        },
        {
          errors: ['an error 2', 'an error 3']
        }
      ]

      wrapper.vm.handleSentinelSampleCreationResponse(response)
      wrapper.vm.$nextTick(() => {
        expect(wrapper.findComponent({ ref: 'alert' }).text()).toMatch(
          /an error 1, an error 2, an error 3/
        )
      })
    })

    it('on partial success/failure', () => {
      response = [
        {
          errors: ['an error 1']
        },
        {
          errors: ['an error 2']
        },
        {
          data: {
            plate_barcode: 'aBarcode1',
            centre: 'tst1',
            number_of_positives: 1
          }
        },
        {
          data: {
            plate_barcode: 'aBarcode2',
            centre: 'tst1',
            number_of_positives: 1
          }
        }
      ]

      wrapper.vm.handleSentinelSampleCreationResponse(response)
      wrapper.vm.$nextTick(() => {
        expect(wrapper.findComponent({ ref: 'alert' }).text()).toMatch(
          /an error 1/
        )
      })
      expect(wrapper.vm.items).toEqual(response.slice(2).map((obj) => obj.data))
    })
  })
})