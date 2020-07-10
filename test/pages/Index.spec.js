import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Index from '@/pages/index.vue'
import ReportsJson from '../data/reports'
import flushPromises from 'flush-promises'

const $axios = {
  $get: jest.fn()
}

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Index', () => {

  let wrapper

  it('is a Vue instance', () => {
    wrapper = mount(Index, { localVue } )
    expect(wrapper.findComponent(Index).exists()).toBeTruthy()
  })

  describe('#reportsProvider', () => {

    beforeEach(() => {
      wrapper = mount(Index, { localVue, mocks: { $axios } } )
    })

    it('when the request is successful',  async () => {
      $axios.$get.mockResolvedValue({data: ReportsJson})
      wrapper = mount(Index, { localVue, mocks: { $axios } } )
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(ReportsJson.reports.length)
    })

    it('when the request fails', async () => {
      $axios.$get.mockImplementationOnce(() => Promise.reject(new Error('There was an error')))
      wrapper = mount(Index, { localVue, mocks: { $axios } } )
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(0)
    })

  })

  describe('#createReport', () => {
    
  })
})