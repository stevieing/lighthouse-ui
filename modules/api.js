import { getPlatesFromBoxBarcodes } from './labwhere'
import { createPlatesFromBarcodes } from './lighthouse_service'

// Main API handling of requests:
// 1. Request the plate barcodes in a given box barcode from LabWhere
// 2. For each plate, POST requests to Lighthouse service to create the plate,
//    creating only the plates +ve samples
// Returns a list of data response objects and/or error objects
// E.g
// [
//   {
//     errors: ['an error 1']
//   },
//   {
//     data: {
//       plate_barcode: 'aBarcode2',
//       centre: 'tst1',
//       number_of_positives: 1
//     }
//   }
// ]

const createSamples = async (boxBarcode) => {
  const platesForBoxBarcode = await getPlatesFromBoxBarcodes(boxBarcode)

  if (!platesForBoxBarcode.success) {
    return [
      {
        errors: [`Failed to get plate barcodes for box barcode: ${boxBarcode}`]
      }
    ]
  }

  const response = await createPlatesFromBarcodes(platesForBoxBarcode)

  return response
}

export { createSamples }
