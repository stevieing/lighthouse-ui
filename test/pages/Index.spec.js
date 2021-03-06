import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import ReportsJson from '../data/reports'
import Index from '@/pages/index.vue'

const $axios = {
  $get: jest.fn(),
  $post: jest.fn()
}

const process = {
  env: {
    LIGHTHOUSE_BASE_URL: 'lighthouse'
  }
}

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Index', () => {
  let wrapper

  beforeEach(() => {
    $axios.$get = jest.fn()
    $axios.$post = jest.fn()
  })

  it('is a Vue instance', () => {
    wrapper = mount(Index, { localVue })
    expect(wrapper.findComponent(Index).exists()).toBeTruthy()
  })

  describe('#reportsProvider', () => {
    beforeEach(() => {
      wrapper = mount(Index, { localVue, mocks: { $axios, process } })
    })

    it('when the request is successful', async () => {
      $axios.$get.mockResolvedValue(ReportsJson)
      wrapper = mount(Index, { localVue, mocks: { $axios, process } })
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(
        ReportsJson.reports.length
      )
    })

    it('when the request fails', async () => {
      $axios.$get.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      wrapper = mount(Index, { localVue, mocks: { $axios, process } })
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(0)
    })
  })

  describe('#createReport', () => {
    it('when the request is successful', async () => {
      $axios.$post.mockResolvedValue('success')
      $axios.$get.mockResolvedValue(ReportsJson)
      const wrapper = mount(Index, { localVue, mocks: { $axios, process } })
      const button = wrapper.find('#createReport')
      await button.trigger('click')
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(
        ReportsJson.reports.length
      )
    })

    it('when the request fails', async () => {
      $axios.$post.mockImplementationOnce(() =>
        Promise.reject(new Error('There was an error'))
      )
      const wrapper = mount(Index, { localVue, mocks: { $axios, process } })
      const button = wrapper.find('#createReport')
      await button.trigger('click')
      await flushPromises()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(0)
      expect(wrapper.find('.alert').text()).toMatch(
        'There was an error creating the report'
      )
    })
  })
})
