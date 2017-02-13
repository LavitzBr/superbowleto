import test from 'ava'
import { assert } from '../../test-utils/chai'
import { normalizeHandler } from '../../test-utils/normalizer'
import { createQueue } from '../queue/test-utils'
import { boletoMock } from './test-utils'
import * as boletoHandler from '../../../src/resources/boleto/handler'

const create = normalizeHandler(boletoHandler.create)

test('creates a boleto', async (t) => {
  const queue = await createQueue()
  const payload = Object.assign({}, boletoMock, {
    queue_id: queue.id
  })

  const { body, statusCode } = await create({
    body: payload
  })

  t.is(statusCode, 201)
  t.true(body.title_id != null)
  t.true(typeof body.title_id === 'number')
  assert.containSubset(body, {
    status: 'pending_registration',
    paid_amount: 0,
    amount: 2000,
    instructions: 'Please do not accept after expiration_date',
    issuer: 'bradesco',
    issuer_id: 'ciz04q0oi000001ppjf0lq4pa',
    payer_name: 'John Appleseed',
    payer_document_type: 'cpf',
    payer_document_number: '98154524872'
  })
})
